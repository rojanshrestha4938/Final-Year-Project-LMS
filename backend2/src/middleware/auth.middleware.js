import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { User } from "../models/user.model.js";
export const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                message:"token not found",
            });
        }
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({
                message:"Invalid token",
            });
        }
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(401).json({
                message:"User not found",
            });
        }
        req.user = user;
        next();

    }catch(error){
        console.error("Error in protectRoute middleware:", error);
    }
}

export const adminRoute =async (req, res, next) => {
    try {
        if(req.user && req.user.email === ENV.ADMIN){
            next();
        }
    }catch(error){
        console.error("Error in adminRoute middleware:", error);
    }
}
