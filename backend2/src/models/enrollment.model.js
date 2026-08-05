import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    stripeSessionId:{
        type: String,
        unique: true
    }

},{timestamps:true});

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);