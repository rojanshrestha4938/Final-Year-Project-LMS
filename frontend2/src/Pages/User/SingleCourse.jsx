import { Spinner } from '@/components/ui/spinner'
import { useGetSingleCourseHook } from '@/hooks/Course.hook'
import { usePayment } from '@/hooks/payment.hook'
import { useGetSimilarCoursesHook } from '@/hooks/recommendation.hook'
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Sparkles, Star, Users, Clock, ArrowRight } from 'lucide-react'

const SingleCourse = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data, isLoading } = useGetSingleCourseHook(id)
    const { mutate, isPending } = usePayment()
    const { data: similarData, isLoading: similarLoading } = useGetSimilarCoursesHook(id, 3)

    const purchaseHandler = (course) => {
        const product = {
            products: {
                _id: course._id,
                name: course.title,
                price: course.amount,
                image: course.thumbnail,
            },
        }
        mutate(product)
    }

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Spinner />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-lg p-8 mb-12">

                    {/* Course Image */}
                    <div className="flex items-center justify-center bg-slate-50 rounded-xl overflow-hidden">
                        <img
                            src={data?.thumbnail}
                            alt={data?.title}
                            className="w-full h-full object-cover rounded-xl hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    {/* Course Details */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <div className='flex items-center gap-2 mb-4'>
                                <span className='px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider'>
                                    {data?.category || 'Best Seller'}
                                </span>
                                <div className='flex items-center gap-1 text-yellow-500'>
                                    <Star className='w-4 h-4 fill-current' />
                                    <span className='text-sm font-bold'>4.9 (2.3k reviews)</span>
                                </div>
                            </div>

                            <h1 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
                                {data?.title}
                            </h1>

                            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                                {data?.description || "Upgrade your skills with this professional course designed by industry experts."}
                            </p>

                            <div className='grid grid-cols-2 gap-4 mb-8'>
                                <div className='flex items-center gap-3 p-3 bg-slate-50 rounded-xl'>
                                    <Users className='w-5 h-5 text-indigo-500' />
                                    <div>
                                        <p className='text-xs text-slate-500 font-medium'>Enrolled</p>
                                        <p className='text-sm font-bold text-slate-800'>1.2k+ Students</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-3 p-3 bg-slate-50 rounded-xl'>
                                    <Clock className='w-5 h-5 text-indigo-500' />
                                    <div>
                                        <p className='text-xs text-slate-500 font-medium'>Duration</p>
                                        <p className='text-sm font-bold text-slate-800'>15+ Hours</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-4xl font-black text-emerald-600">
                                    ₹{data?.amount}
                                </span>
                                <div className='flex flex-col'>
                                    <span className="text-sm text-gray-400 line-through">
                                        ₹{Number(data?.amount) + 999}
                                    </span>
                                    <span className='text-xs font-bold text-emerald-500 uppercase'>60% OFF</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <button
                            disabled={isPending}
                            onClick={() => purchaseHandler(data)}
                            className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-xl
                            hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-60 
                            disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                        >
                            {isPending ? <Spinner /> : (
                                <>
                                    Buy Now
                                    <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Similar Courses Section */}
                {similarData?.similarCourses?.length > 0 && (
                    <div className="mt-16">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">You might also like</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {similarData.similarCourses.map((item) => (
                                <div
                                    key={item._id}
                                    onClick={() => {
                                        navigate(`/singleCourse/${item._id}`)
                                        window.scrollTo(0, 0)
                                    }}
                                    className="group bg-white border border-slate-100 rounded-2xl p-4 hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
                                >
                                    <div className="relative mb-4 overflow-hidden rounded-xl h-40 bg-slate-100">
                                        <img
                                            src={item.thumbnail}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {item.similarityScore > 0.5 && (
                                            <div className="absolute top-3 right-3 bg-indigo-600 text-[10px] font-bold text-white px-2 py-1 rounded-lg uppercase tracking-wider">
                                                Highly Similar
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-indigo-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                            <span className="text-xs font-bold text-slate-600 italic">Recommended</span>
                                        </div>
                                        <span className="font-bold text-slate-900">₹{item.amount}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SingleCourse

