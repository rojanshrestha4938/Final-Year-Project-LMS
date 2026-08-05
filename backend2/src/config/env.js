import dotenv from "dotenv";
dotenv.config();

export const ENV ={
    MONGODB_URI: process.env.MONGODB_URI,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    ADMIN:process.env.ADMIN,
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API_KEY: process.env.CLOUD_API_KEY,
    CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    CLIENT_URL: process.env.CLIENT_URL,
}
