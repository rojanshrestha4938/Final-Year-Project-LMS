import { checkQuizApi, createQuiz, getQuizApi } from '@/Api/quiz.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useCreateQuiz = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createQuiz,
        onSuccess: (data) => {
            toast.success(data.message)
            console.log(data)
            // Invalidate the course query so modules refresh and show "Take Quiz"
            queryClient.invalidateQueries({ queryKey: ['getPurchaseCourse'] })
        },
        onError: (err) => {
            console.log(err)
            toast.error('Failed to generate quiz. Please try again.')
        }
    })
}


export const useGetQuiz = (id) => {
    return useQuery({
        queryFn: () => getQuizApi(id),
        queryKey: ['getQuiz', id]

    })
}

export const useCheckQuiz = (id) => {
    return useQuery({
        queryFn: () => checkQuizApi(id),
        queryKey: ['checkQuiz', id],
        enabled: !!id
    })
}