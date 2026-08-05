import express from "express";
import { Register, Login, getUser, logout } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const userRouter = express.Router();

userRouter.post('/register', Register);
userRouter.post('/login', Login);
userRouter.post('/logout', logout);
userRouter.get('/getUser', protectRoute, getUser);

export default userRouter;