import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
    getRecommendations,
    getSimilarCourses
} from "../controllers/recommendation.controller.js";

const recommendationRoute = express.Router();

// Get personalized recommendations for the logged-in user
recommendationRoute.get("/recommendations", protectRoute, getRecommendations);

// Get courses similar to a specific course (for "You might also like" sections)
recommendationRoute.get("/similar/:courseId", protectRoute, getSimilarCourses);

export default recommendationRoute;
