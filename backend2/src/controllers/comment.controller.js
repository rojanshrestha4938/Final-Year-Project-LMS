import { Comment } from "../models/comment.model.js";
import { Module } from "../models/module.model.js";
export const createComment = async(req, res)=>{
    try {
        const moduleId = req.params.id;
        const {comment} = req.body || {};
        const userId = req.user._id
        if(!moduleId){
            return res.status(401).json({
                message:"Module Id not found"
            })
        }
        if(!comment){
            return res.status(401).json({
                message:"comment is required"
            })
        }

        const module = await Module.findById(moduleId)
        if(!module){
            return res.status(401).json({
                message:"Module not found"
            })
        }
        const newComment = await Comment.create({
            userId,
            moduleId,
            comment
        })
        await Module.findByIdAndUpdate(
            moduleId,
            {$push:{comments:newComment._id}},
            {returnDocument: 'after'}
        )

        const populatedComment = await Comment.findById(newComment._id).populate('userId', "fullName email")
        return res.status(201).json({
            message:"comment added",
            populatedComment
        })
    } catch (error) {
        console.log(error)
    }
}