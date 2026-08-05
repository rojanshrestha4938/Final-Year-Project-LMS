import { useGetCourseHook } from '@/hooks/Course.hook'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Search } from 'lucide-react'
import CourseCard from './CourseCard'

const CourseSection = ({ ActiveSearch }) => {
    const { data, error, isLoading } = useGetCourseHook(ActiveSearch)
    const navigate = useNavigate()

    const navigateSinglecourse = (id) => {
        navigate(`/singleCourse/${id}`)
    }

    if (isLoading) {
        return (
            <div className='py-20 px-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto'>
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className='animate-pulse bg-slate-900 border border-slate-800 rounded-2xl p-4'>
                            <div className='bg-slate-800 h-40 rounded-xl mb-4'></div>
                            <div className='h-6 bg-slate-800 rounded w-3/4 mb-3'></div>
                            <div className='h-4 bg-slate-800 rounded w-1/2'></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className='py-12 px-6 bg-transparent'>
            <div className='max-w-7xl mx-auto'>
                <div className='flex items-center justify-between mb-8'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30'>
                            {ActiveSearch ? (
                                <Search className='w-5 h-5 text-white' />
                            ) : (
                                <BookOpen className='w-5 h-5 text-white' />
                            )}
                        </div>
                        <div>
                            <h2 className='text-2xl font-bold bg-gradient-brand bg-clip-text text-transparent tracking-tight'>
                                {ActiveSearch ? `Results for "${ActiveSearch}"` : 'Available Courses'}
                            </h2>
                            <p className='text-sm text-slate-400 font-medium'>
                                {ActiveSearch
                                    ? `Found ${data?.courses?.length || 0} matches`
                                    : 'Explore our wide range of professional courses'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                    {data?.courses?.map((item) => (
                        <CourseCard
                            key={item._id}
                            course={item}
                            onClick={navigateSinglecourse}
                        />
                    ))}
                </div>

                {data?.courses?.length === 0 && !isLoading && (
                    <div className='text-center py-32'>
                        <BookOpen className='w-24 h-24 text-slate-800 mx-auto mb-8' />
                        <h2 className='text-2xl font-bold text-slate-300 mb-2'>No courses found</h2>
                        <p className='text-slate-500 max-w-md mx-auto text-lg'>
                            Try adjusting your search or explore our popular courses below
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CourseSection

