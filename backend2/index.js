import express from "express";
import { connectDB } from "./src/config/db.js";
import cookieParser from "cookie-parser";
import userRouter from "./src/routes/user.route.js";
import courseRoute from "./src/routes/course.route.js";
import moduleRoute from "./src/routes/module.route.js";
import quizRoute from "./src/routes/quiz.route.js";
import { ENV } from "./src/config/env.js";
import analyticRoute from "./src/routes/analytic.route.js";
import paymentRoute from "./src/routes/payment.route.js";
import commentRoute from "./src/routes/comment.route.js";
import recommendationRoute from "./src/routes/recommendation.route.js";
import cors from "cors"


const app = express();

app.use(cors({
    origin:ENV.CLIENT_URL,
    credentials:true
}))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", userRouter);
app.use("/api/course", courseRoute);
app.use("/api/module", moduleRoute);
app.use("/api/quiz", quizRoute);
app.use("/api/comment", commentRoute);

app.use('/api/analytic', analyticRoute)

app.use("/api/payment", paymentRoute);
app.use("/api/recommendation", recommendationRoute);


// Connect to database before starting server
connectDB();

app.listen(5000, () => {
    console.log(`Server is running on port `+5000);
});