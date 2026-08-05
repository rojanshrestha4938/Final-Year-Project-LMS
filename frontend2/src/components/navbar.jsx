import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useLoggedOut } from '@/hooks/User.hook'
import { Spinner } from './ui/spinner'
import { Link, useNavigate } from 'react-router-dom'
import { useUserStore } from '@/Store/user.store.jsx'
import { LogOut, User, LayoutDashboard, BookOpen } from 'lucide-react'

const Navbar = () => {
    const navigate = useNavigate()
    const { mutate, isPending } = useLoggedOut()
    const { user } = useUserStore()

    const logoutHandler = () => {
        mutate()
    }

    const navItems = [
        ...(user?.user?.admin ? [{
            label: 'Dashboard',
            icon: LayoutDashboard,
            onClick: () => navigate('/dashboard')
        }] : []),
        {
            label: 'Profile',
            icon: User,
            onClick: () => navigate('/profile')
        },
        {
            label: 'Your Courses',
            icon: BookOpen,
            onClick: () => navigate('/YourCourse')
        },
        {
            label: 'Logout',
            icon: LogOut,
            onClick: logoutHandler,
            loading: isPending
        }
    ]

    return (
        <div className='h-[12vh] w-full flex items-center justify-between px-6 lg:px-9 shadow-lg bg-white/90 backdrop-blur-md border-b border-slate-200'>
            {/* Logo */}
            <Link to='/' className='flex items-center cursor-pointer'>
                <img src="/logo.png" alt="SikshyaTech" className='h-32 w-auto object-contain' />
            </Link>

            {/* User Menu */}
            <Popover>
                <PopoverTrigger className='flex items-center gap-3 p-2 hover:bg-slate-100 rounded-xl transition-all duration-200 group cursor-pointer'>
                    <Avatar className='w-10 h-10 ring-2 ring-slate-200 group-hover:ring-cyan-500 transition-all shadow-md shadow-cyan-500/10'>
                        <AvatarImage
                            src={user?.profilePhoto || "https://github.com/shadcn.png"}
                            className='object-cover'
                        />
                        <AvatarFallback className='bg-gradient-brand text-white font-semibold text-sm'>
                            {user?.fullName ? user.fullName.slice(0, 2).toUpperCase() : 'CN'}
                        </AvatarFallback>
                    </Avatar>

                    <div className='hidden md:block text-left'>
                        <p className='font-semibold text-sm text-slate-900 leading-tight'>
                            {user?.user?.email || 'User'}
                        </p>
                        <p className='text-xs text-slate-500 font-medium tracking-wide'>
                            {user?.user?.admin ? 'Admin' : 'Client'}
                        </p>
                    </div>

                    {/* Chevron indicator */}
                    <svg className='w-4 h-4 text-slate-400 ml-1 group-hover:text-cyan-500 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                    </svg>
                </PopoverTrigger>

                <PopoverContent className='w-64 p-1 mt-2 bg-white border-slate-200 shadow-2xl rounded-2xl'>
                    <div className='p-4 border-b border-slate-100'>
                        <p className='font-semibold text-slate-900 text-sm tracking-tight'>
                            {user?.fullName || 'Welcome back'}
                        </p>
                        <p className='text-xs text-slate-500 font-medium'>
                            Manage your account
                        </p>
                    </div>

                    <div className='py-2 space-y-1'>
                        {navItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={item.onClick}
                                disabled={item.loading}
                                className='group relative w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all duration-200 hover:bg-slate-50 hover:shadow-sm text-sm font-medium text-slate-700 hover:text-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                <item.icon className='w-4 h-4 text-slate-400 group-hover:text-cyan-500 flex-shrink-0' />
                                <span className='truncate'>{item.label}</span>

                                {item.loading && (
                                    <div className='absolute right-4'>
                                        <Spinner className='w-4 h-4' />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default Navbar
