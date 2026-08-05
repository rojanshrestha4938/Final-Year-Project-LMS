import React from 'react'
import { Star, Users, Clock, Info, Sparkles, BookOpen } from 'lucide-react'

const CourseCard = ({ course, onClick, showSimilarity = false, reason = null }) => {
    return (
        <div
            onClick={() => onClick(course._id)}
            className='group bg-slate-900 border border-indigo-500/20 rounded-2xl p-4 hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-500/50
            hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden relative'
        >
            {/* Similarity/Recommendation Badge */}
            {showSimilarity && course.similarityScore > 0 && (
                <div className='absolute top-6 left-6 z-10 bg-gradient-brand backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-xl shadow-purple-500/30 flex items-center gap-1.5 border border-white/20'>
                    <Sparkles className='w-3 h-3 text-white' />
                    <span className='text-[10px] font-bold text-white uppercase tracking-wider'>
                        {Math.round(course.similarityScore * 100)}% Match
                    </span>
                </div>
            )}

            {/* Thumbnail */}
            <div className='relative mb-4 overflow-hidden rounded-xl h-40'>
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
            </div>

            {/* Content */}
            <div>
                <div className='flex items-center gap-1 mb-2'>
                    <Info className='w-3 h-3 text-cyan-400' />
                    <span className='text-[10px] font-bold text-cyan-400 uppercase tracking-wide truncate max-w-[150px]'>
                        {reason || course.category || (course.tags?.[0]) || 'General'}
                    </span>
                </div>

                <h3 className='font-bold text-white leading-tight mb-3 line-clamp-2 min-h-[2.5rem] group-hover:text-cyan-400 transition-colors'>
                    {course.title}
                </h3>

                <div className='space-y-2 mb-4'>
                    <div className='flex items-center gap-2 text-[11px] text-slate-400 font-medium'>
                        <Users className='w-3.5 h-3.5' />
                        <span>{course.enrolled || '1.2k'} students</span>
                    </div>
                    <div className='flex items-center gap-2 text-[11px] text-slate-400 font-medium'>
                        <Clock className='w-3.5 h-3.5' />
                        <span>{course.duration || '12+ hours'}</span>
                    </div>
                </div>

                <div className='flex items-center justify-between pt-3 border-t border-slate-800/50'>
                    <div className='flex items-center gap-1.5'>
                        <Star className='w-3.5 h-3.5 text-yellow-500 fill-current' />
                        <span className='text-xs font-bold text-slate-300'>{course.rating || '4.8'}</span>
                    </div>
                    <span className='text-sm font-black text-cyan-400'>
                        ₹{course.amount}
                    </span>
                </div>
            </div>

            {/* Hover Action */}
            <div className='mt-4 overflow-hidden h-0 group-hover:h-10 transition-all duration-300'>
                <button className='w-full h-full bg-gradient-brand text-white text-xs font-bold rounded-lg hover:brightness-110 transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 relative overflow-hidden'>
                    <span className="relative z-10 flex items-center gap-2">View Course <BookOpen className="w-3.5 h-3.5" /></span>
                </button>
            </div>
        </div>
    )
}

export default CourseCard
