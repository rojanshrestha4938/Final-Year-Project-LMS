import React from 'react'
import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard,
    ShoppingBag,

    Home,
    BarChart3
} from 'lucide-react'

const DashboardSideBar = () => {
    const navItems = [
        { to: '/', label: 'Home', icon: Home },
        { to: '/dashboard', label: 'Analytics', icon: BarChart3 },
        { to: '/dashboard/dashboardProduct', label: 'Courses', icon: ShoppingBag },

    ]

    return (
        <div className='w-64 bg-slate-950 shadow-xl border-r border-indigo-500/20'>
            <div className='p-6 border-b border-indigo-500/20 flex flex-col items-center'>
                <img src="/logo.png" alt="SikshyaTech" className='h-20 w-auto object-contain brightness-0 invert' />
                <p className='text-xs bg-gradient-brand bg-clip-text text-transparent font-bold mt-2 tracking-widest uppercase'>Admin Dashboard</p>
            </div>

            <nav className='p-4 space-y-1'>
                {navItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.to}
                        end={item.to === '/' || item.to === '/dashboard'}
                        className={({ isActive }) =>
                            `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
              ${isActive
                                ? 'bg-gradient-brand text-white shadow-lg shadow-cyan-500/30'
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-cyan-400 hover:shadow-md'
                            }`
                        }
                    >
                        <item.icon className='w-5 h-5 flex-shrink-0' />
                        <span className='truncate'>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    )
}

export default DashboardSideBar
