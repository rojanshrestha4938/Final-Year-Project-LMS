import axios from "axios";

export const getRecommendationsApi = async (limit = 5) => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/recommendation/recommendations`, {
        params: { limit },
        withCredentials: true
    });
    return res.data;
};

export const getSimilarCoursesApi = async (courseId, limit = 5) => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/recommendation/similar/${courseId}`, {
        params: { limit },
        withCredentials: true
    });
    return res.data;
};
