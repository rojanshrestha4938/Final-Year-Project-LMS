import cloudinary from "../config/cloudinary.js";
import { ENV } from "../config/env.js";
import { Course } from "../models/course.model.js";
import { GoogleGenerativeAI } from '@google/generative-ai'
import { User } from "../models/user.model.js";
import { Quiz } from "../models/quiz.model.js";
import { invalidateSimilarityCache } from './recommendation.controller.js'
const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

export const createCourse = async (req, res) => {
    try {
        const { title, description, amount, tags, category, difficulty, keywords } = req.body;
        const thumbnail = req.file

        if (!title || !description || !amount) {
            return res.status(401).json({
                message: "Please provide all the detail"
            })
        }
        if (!thumbnail) {
            return res.status(400).json({
                message: "Please upload a thumbnail image"
            })
        }
        let imageUrl = ""

        const base64 = `data:${req.file.mimetype};base64,${thumbnail.buffer.toString("base64")}`;

        const uploadRes = await cloudinary.uploader.upload(base64, {
            folder: "lmsYT"
        })

        imageUrl = uploadRes.secure_url

        const newCourse = new Course({
            userId: req.user._id,
            title,
            description,
            thumbnail: imageUrl,
            amount,
            tags: typeof tags === 'string' ? JSON.parse(tags) : tags,
            category,
            difficulty,
            keywords: typeof keywords === 'string' ? JSON.parse(keywords) : keywords
        })

        await newCourse.save()

        // Invalidate recommendation cache when a new course is added
        invalidateSimilarityCache();

        return res.status(201).json({
            message: "Course Created Successfully",
            newCourse
        })

    } catch (error) {
        console.log(`error from create course. ${error}`)
    }
}



export const getCourse = async (req, res) => {
    try {

        const { search } = req.query;

        if (!search || search.trim() === "") {
            const allCourses = await Course.find()

            return res.status(201).json({
                courses: allCourses
            })
        }

        const prompt = `You are an intelligent assistant for a learning managemenge platform System . A user is searching for courses. analyze the query and return the most relevant keyword from these categories
        
        -Artificial intelligence,
        -MERN Stack,
        -DevOps,
        -Mobile Development

        only reply with one keyword that best matches the query no explanation

        user query: ${search}
        `

        let searchTerm = search;

        try {
            const result = await model.generateContent(prompt);

            const aiText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text
                ?.trim()
                .replace(/[`"\n]/g, "") || "";

            console.log("search ", search)
            console.log("Ai text", aiText)

            if (aiText) {
                searchTerm = aiText;
            }
        } catch (aiError) {
            console.log("Gemini AI unavailable, falling back to direct search:", aiError.message)
        }

        const mongoQuery = {
            $or: [
                { title: { $regex: searchTerm, $options: "i" } },
                { description: { $regex: searchTerm, $options: "i" } },
            ]
        }

        const courses = await Course.find(mongoQuery).lean()

        console.log(`found ,${courses.length} , courses ${search}`)


        return res.status(201).json({
            success: true,
            courses,
            count: courses.length,
            searchTerm: search,

        })






    } catch (error) {
        console.log(`error from getCourse, ${error}`)
        return res.status(500).json({ message: "Error fetching courses" })
    }
}



export const getSingleCourse = async (req, res) => {
    try {
        const courseId = req.params.id;

        const course = await Course.findById(courseId).populate("modules")


        if (!course) {
            return res.status(401).json({
                message: "Course not found"
            })
        }


        return res.status(201).json(course)
    } catch (error) {
        console.log(error, " from get single course")
    }
}


export const getPurchasedCourse = async (req, res) => {
    try {
        const courseId = req.params.id;

        if (!courseId) {
            return res.status(400).json({
                message: "course not found"
            })
        }

        const course = await Course.findById(courseId).populate({
            path: "modules",
            populate: {
                path: "quiz"
            }
        }).lean();

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            })
        }

        const moduleIds = (course.modules || []).map(m => m._id);
        const userQuizzes = await Quiz.find({
            userId: req.user._id,
            moduleId: { $in: moduleIds }
        });

        const userQuizMap = {};
        userQuizzes.forEach(q => {
            if (q.questions && q.questions.length > 0) {
                userQuizMap[q.moduleId.toString()] = q._id;
            }
        });

        course.modules = (course.modules || []).map(m => {
            let validQuizId = userQuizMap[m._id.toString()] || null;
            if (!validQuizId && m.quiz && m.quiz.questions && m.quiz.questions.length > 0) {
                validQuizId = m.quiz._id;
            }
            return {
                ...m,
                quiz: validQuizId
            };
        });

        return res.status(200).json(course)
    } catch (error) {
        console.log(error, "from getPurchased course")
        return res.status(500).json({ message: "Error fetching purchased course" })
    }
}


export const getAllPurchasedCourse = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId).populate("purchasedCourse")

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            })
        }

        return res.status(201).json(user)
    } catch (error) {
        console.log(error)
    }
}