import { GoogleGenerativeAI } from "@google/generative-ai";
import { Quiz } from "../models/quiz.model.js";
import { ENV } from "../config/env.js";
import { Questions } from "../models/question.model.js";
import { Module } from "../models/module.model.js";

const genAi = new GoogleGenerativeAI(ENV.GEMINI_API_KEY)
const model = genAi.getGenerativeModel({ model: 'gemini-2.5-flash' })

export const checkQuiz = async (req, res) => {
    try {
        const moduleId = req.params.id;

        const quiz = await Quiz.findOne({
            userId: req.user._id,
            moduleId
        })
        return res.status(201).json({
            success: true,
            hasQuiz: quiz,
            quiz: quiz || null
        })
    } catch (error) {
        console.log(error, "from check quiz")
    }
}

export const generateQuiz = async (req, res) => {
    try {
        const { moduleId, content } = req.body;
        console.log('generateQuiz called with:', { moduleId, content, userId: req.user._id });

        if (!moduleId || !content) {
            return res.status(400).json({
                message: "moduleId and content are required"
            })
        }

        const existingQuiz = await Quiz.findOne({
            userId: req.user._id,
            moduleId
        })

        // If quiz exists and already has questions, return early
        if (existingQuiz && existingQuiz.questions.length > 0) {
            return res.status(200).json({
                message: "Quiz already exists for this module",
                quizId: existingQuiz._id
            })
        }

        // If a stale/failed quiz exists with 0 questions, delete it first
        if (existingQuiz && existingQuiz.questions.length === 0) {
            console.log('Deleting stale quiz with no questions:', existingQuiz._id)
            await Quiz.findByIdAndDelete(existingQuiz._id)
        }

        // Create a fresh quiz
        const newQuiz = await Quiz.create({
            userId: req.user._id,
            moduleId
        })
        console.log('Created new quiz:', newQuiz._id)

        const prompt = `Generate 10 technical questions for the topic: "${content}". 
Each question must be multiple choice with exactly 4 options.
Return ONLY valid JSON in this exact format, no markdown, no extra text:
{"questions":[{"question":"string","options":["string","string","string","string"],"correctOption":"string","explanation":"string"}]}`

        console.log('Calling Gemini API...')
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                thinkingConfig: { thinkingBudget: 0 }
            }
        })

        const text = result.response.text()
        console.log('Gemini response received, length:', text.length)

        let parsed
        try {
            parsed = JSON.parse(text)
        } catch (parseError) {
            console.error("Failed to parse Gemini response:", parseError.message)
            console.error("Raw response:", text)
            await Quiz.findByIdAndDelete(newQuiz._id)
            return res.status(500).json({ message: "Quiz generation failed: invalid AI response" })
        }

        const generatedQuestions = parsed.questions || []
        console.log('Questions generated:', generatedQuestions.length)

        if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
            console.error("No questions in parsed response:", parsed)
            await Quiz.findByIdAndDelete(newQuiz._id)
            return res.status(500).json({ message: "No questions were generated" })
        }

        const questionDocs = generatedQuestions.map((q) => ({
            quizId: newQuiz._id,
            content: q.question,
            options: q.options,
            correctOption: q.correctOption,
            explanation: q.explanation
        }))

        const createdQuestions = await Questions.insertMany(questionDocs)
        const ids = createdQuestions.map((q) => q._id)

        await Quiz.findByIdAndUpdate(
            newQuiz._id,
            { $push: { questions: { $each: ids } } },
            { new: true }
        )
        await Module.findByIdAndUpdate(
            moduleId,
            { quiz: newQuiz._id },
            { new: true }
        )

        console.log('Quiz generation complete! Quiz ID:', newQuiz._id)
        return res.status(201).json({
            message: "Quiz generated successfully",
            quizId: newQuiz._id
        })
    } catch (error) {
        console.error("Error in generateQuiz:", error.message)
        console.error("Stack:", error.stack)
        return res.status(500).json({
            message: "Error generating quiz: " + error.message
        })
    }
}

export const getQuiz = async (req, res) => {
    try {
        const quizId = req.params.id;
        if (!quizId) {
            return res.status(400).json({
                message: "quiz id not found"
            })
        }

        let quiz = await Quiz.findOne({
            _id: quizId,
            userId: req.user._id
        }).populate("questions").populate("moduleId")

        if (!quiz) {
            quiz = await Quiz.findOne({
                moduleId: quizId,
                userId: req.user._id
            }).populate("questions").populate("moduleId")
        }

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            })
        }

        return res.status(200).json({
            success: true,
            quiz
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error fetching quiz" })
    }
}