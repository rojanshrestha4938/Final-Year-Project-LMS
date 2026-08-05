import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
    },
    amount: {
        type: Number,
        required: true
    },
    // ─── Recommendation Engine Fields ───
    tags: {
        type: [String],       // e.g. ["web", "html", "frontend"]
        default: []
    },
    category: {
        type: String,         // e.g. "Web Development", "AI/ML", "DevOps"
        default: ""
    },
    difficulty: {
        type: String,         // "beginner", "intermediate", "advanced"
        enum: ["beginner", "intermediate", "advanced", ""],
        default: ""
    },
    keywords: {
        type: [String],       // Extracted keywords from title/description
        default: []
    },
    modules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
    }]
}, { timestamps: true });

export const Course = mongoose.model("Course", courseSchema);
