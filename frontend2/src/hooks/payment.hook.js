import { checkOutSuccessApi, purchaseCourseApi } from '@/Api/purchase.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const usePayment = ()=>{
    return useMutation({
        mutationFn:purchaseCourseApi,
        onSuccess:(data)=>{
            if(data.url){
                window.location.href=data.url
            }
            // toast.success(data.message)
        },
        onError:(err)=>{
            console.log(err)
        }
    })
}

export const useCheckoutSuccess=()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:(sessionId)=>checkOutSuccessApi(sessionId),
        onSuccess:(data)=>{
            toast.success(data.message)
            queryClient.invalidateQueries(['getRecommendations'])
            queryClient.invalidateQueries(['getAllPurchaseCourse'])
        },
        onError:(err)=>{
            console.log(err)
        }
    })
}