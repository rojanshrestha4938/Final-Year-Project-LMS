import React from 'react'
import { Link } from 'react-router-dom'
import {
    Mail,
    Phone,
    Globe,
    BookOpen,
    Home,
    Search
} from 'lucide-react'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className='bg-[#171c3e] border-t border-white/10 text-slate-300 pt-16 pb-8'>
            <div className='max-w-7xl mx-auto px-6 lg:px-9'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
                    {/* Brand */}
                    <div className='space-y-4'>
                        <img src="/logo.png" alt="SikshyaTech" className='h-32 w-auto object-contain brightness-0 invert' />
                        <p className='text-sm text-slate-400'>
                            Leading the way in digital education and professional growth. Join our community of learners today.
                        </p>
                        <div className='flex gap-4'>
                            <Globe size={18} className='hover:text-cyan-400 cursor-pointer transition-colors' />
                            <Mail size={18} className='hover:text-cyan-400 cursor-pointer transition-colors' />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className='text-white font-bold mb-6 text-sm uppercase tracking-wider'>Study</h3>
                        <ul className='space-y-3 text-sm text-slate-300'>
                            <li><Link to='/' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className='hover:text-cyan-400 flex items-center gap-2'><BookOpen size={14} /> Browse Courses</Link></li>
                            <li><Link to='/YourCourse' className='hover:text-cyan-400 flex items-center gap-2'><Home size={14} /> My Learning</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className='text-white font-bold mb-6 text-sm uppercase tracking-wider'>Support</h3>
                        <ul className='space-y-4 text-sm text-slate-300'>
                            <li className='flex items-center gap-2'><Mail size={14} /> info@sikshyatech.com</li>
                            <li className='flex items-center gap-2'><Phone size={14} /> +1 234 567 890</li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className='text-white font-bold mb-6 text-sm uppercase tracking-wider'>Newsletter</h3>
                        <div className='flex bg-white/5 rounded-xl overflow-hidden border border-white/10 shadow-sm p-1'>
                            <input
                                type='email'
                                placeholder='Email address'
                                className='bg-transparent px-3 py-2 text-sm flex-grow outline-none text-white placeholder-slate-400'
                            />
                            <button className='bg-gradient-brand hover:brightness-110 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md shadow-cyan-500/20'>
                                Join
                            </button>
                        </div>
                        <p className='text-[10px] text-slate-400 mt-2 ml-1'>Get latest updates and course news.</p>
                    </div>
                </div>

                <div className='mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-400 gap-4'>
                    <p>© {currentYear} <span className='text-white font-bold'>SikshyaTech Pvt. Ltd.</span> All rights reserved.</p>
                    <div className='flex items-center gap-6'>
                        <Link to='/privacy' className='hover:text-cyan-400 font-medium transition-colors'>Privacy Policy</Link>
                        <Link to='/terms' className='hover:text-cyan-400 font-medium transition-colors'>Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
