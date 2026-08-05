import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const Register = async (req, res) => {
    try {
        const{fullName,email,password} = req.body;
        if(!fullName || !email || !password){
            return res.status(401).json({
                message:"All fields are required",
                sucess:false                
            });
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(401).json({
                message:"Email already exists",               
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const newUser=await User.create({
            fullName,
            email,
            password:hashedPassword
        })
        const token = await jwt.sign({userId:newUser._id}, ENV.JWT_SECRET);
        
        res.cookie("token", token, {maxAge: 24 * 60 * 60 * 1000, httpOnly: true, secure:true, sameSite:"none"})
        
        if(newUser.email === ENV.ADMIN){
            return res.status(201).json({
                message:`Welcome back admin ${newUser.fullName}` 
            })
        }

        return res.status(201).json({
            message:`Welcome ${newUser.fullName}` 
        })
    }catch (error) {
        console.error("Error registering user:", error);
    }
}

export const Login = async (req, res) => {
    try {
        const{email,password} = req.body;
        if(!email || !password){
            return res.status(401).json({
                message:"All fields are required",
                sucess:false                
            });
        }

        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({
                message:"User does not exist",               
            });
        }
        
        const isPasswordCorrect= await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(401).json({
                message:"Invalid password",               
            });
        }

        if(user.email === ENV.ADMIN){
            user.admin=true;
            await user.save();
        }

        const token = await jwt.sign({userId:user._id}, ENV.JWT_SECRET);
        res.cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure:true,
            sameSite:"none"
        })

        if(user.admin){
            return res.status(201).json({
                message:`Welcome back admin ${user.fullName}` 
        })}

        return res.status(200).json({
            message:`Welcome back ${user.fullName}` 
        })
    }catch (error) {
        console.error("Error logging in user:", error);
    }
}

export const getUser= async (req, res) => {
    try{
        const userId=req.user._id;
        const user = await User.findById(userId)
        if(!user){
            return res.status(401).json({
                message:"User not found",
            });
        }
        return res.status(201).json({
            user,
        })
    }catch(error){
        console.error("Error in getUser:", error);
    }
}


export const logout = async (req, res) => {
    try {
        res.clearCookie("token","");
        return res.status(201).json({
            message: "User logged out",
        });
    } catch (error) {
        console.error("Error in logout:", error);
    }
}