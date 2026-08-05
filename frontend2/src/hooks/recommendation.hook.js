import { useQuery } from '@tanstack/react-query';
import { getRecommendationsApi, getSimilarCoursesApi } from '@/Api/recommendation.api';

export const useGetRecommendationsHook = (limit = 5) => {
    return useQuery({
        queryFn: () => getRecommendationsApi(limit),
        queryKey: ['getRecommendations', limit],
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useGetSimilarCoursesHook = (courseId, limit = 5) => {
    return useQuery({
        queryFn: () => getSimilarCoursesApi(courseId, limit),
        queryKey: ['getSimilarCourses', courseId, limit],
        enabled: !!courseId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
