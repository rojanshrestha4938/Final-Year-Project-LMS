import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { useGetRecommendationsHook } from '@/hooks/recommendation.hook'
import CourseCard from './CourseCard'

const RecommendedCourses = () => {
    const { data, isLoading, isError } = useGetRecommendationsHook(4)
    const navigate = useNavigate()

    const navigateSingleCourse = (id) => {
        navigate(`/singleCourse/${id}`)
    }

    if (isLoading) {
        return (
            <div className='py-12 px-6 max-w-7xl mx-auto'>
                <div className='flex items-center gap-3 mb-8'>
                    <div className='w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30'>
                        <Sparkles className='w-5 h-5 text-white animate-pulse' />
                    </div>
                    <div>
                        <div className='h-8 bg-slate-800 w-48 rounded-lg animate-pulse mb-2'></div>
                        <div className='h-4 bg-slate-800 w-32 rounded-lg animate-pulse'></div>
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className='animate-pulse bg-slate-900 border border-slate-800 rounded-2xl p-4'>
                            <div className='bg-slate-800 h-40 rounded-xl mb-4'></div>
                            <div className='h-5 bg-slate-800 rounded w-3/4 mb-2'></div>
                            <div className='h-4 bg-slate-800 rounded w-1/2'></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (isError || !data?.recommendations || data.recommendations.length === 0) {
        return null
    }

    return (
        <div className='py-12 px-6 bg-transparent'>
            <div className='max-w-7xl mx-auto'>
                <div className='flex items-center justify-between mb-8'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30'>
                            <Sparkles className='w-5 h-5 text-white' />
                        </div>
                        <div>
                            <h2 className='text-2xl font-bold bg-gradient-brand bg-clip-text text-transparent tracking-tight'>
                                Recommended for You
                            </h2>
                            <p className='text-sm text-slate-400 font-medium'>
                                {data.message || "Based on your learning profile"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                    {data.recommendations.map((item) => (
                        <CourseCard
                            key={item._id}
                            course={item}
                            onClick={navigateSingleCourse}
                            showSimilarity={true}
                            reason={item.reason}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RecommendedCourses

