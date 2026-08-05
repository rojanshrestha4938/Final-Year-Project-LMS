import { useUserStore } from '@/Store/user.store.jsx'
import { useGetCourseHook, useGetAllPurchaseCourse } from '@/hooks/Course.hook'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    User, Mail, Shield, ShieldCheck, BookOpen, Calendar,
    ChevronRight, LayoutDashboard, GraduationCap, TrendingUp
} from 'lucide-react'

const Profile = () => {
    const { user } = useUserStore()
    const navigate = useNavigate()
    const userData = user?.user
    const isAdmin = userData?.admin

    const joinDate = userData?.createdAt
        ? new Date(userData.createdAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        })
        : 'N/A'

    return (
        <div className="min-h-screen bg-slate-950 py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Profile Header Card */}
                <div className="relative bg-slate-900 rounded-3xl shadow-lg shadow-cyan-500/10 border border-indigo-500/20 overflow-hidden">
                    {/* Banner */}
                    <div className="h-36 bg-gradient-brand opacity-90" />

                    {/* Avatar + Info */}
                    <div className="px-8 pb-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-14">
                            {/* Avatar */}
                            <div className="relative z-10 w-28 h-28 rounded-2xl border-[6px] border-slate-900 shadow-2xl flex items-center justify-center text-cyan-400 text-4xl font-black bg-slate-800">
                                {userData?.fullName?.slice(0, 2).toUpperCase() || 'US'}
                            </div>

                            <div className="flex-1 pt-2">
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-2xl font-black text-white">
                                        {userData?.fullName || 'User'}
                                    </h1>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-cyan-400 border border-cyan-500/30">
                                        {isAdmin ? <ShieldCheck className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                                        {isAdmin ? 'Admin' : 'Client'}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm font-medium">{userData?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Account Details */}
                    <div className="bg-slate-900 rounded-2xl shadow-lg shadow-cyan-500/5 border border-indigo-500/20 p-6">
                        <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                            <User className="w-5 h-5 text-cyan-400" />
                            Account Details
                        </h2>
                        <div className="space-y-4">
                            <InfoRow icon={<User className="w-4 h-4" />} label="Full Name" value={userData?.fullName} />
                            <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={userData?.email} />
                            <InfoRow icon={<Calendar className="w-4 h-4" />} label="Joined" value={joinDate} />
                            <InfoRow
                                icon={isAdmin ? <ShieldCheck className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                                label="Role"
                                value={isAdmin ? 'Administrator' : 'Client'}
                            />
                        </div>
                    </div>

                    {/* Role-specific Card */}
                    {isAdmin ? <AdminStatsCard /> : <ClientStatsCard />}
                </div>

                {/* Quick Actions */}
                <div className="bg-slate-900 rounded-2xl shadow-lg shadow-cyan-500/5 border border-indigo-500/20 p-6">
                    <h2 className="text-lg font-bold text-white mb-5">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {isAdmin ? (
                            <>
                                <ActionCard
                                    icon={<LayoutDashboard className="w-5 h-5" />}
                                    title="Dashboard"
                                    desc="View analytics & stats"
                                    onClick={() => navigate('/dashboard')}
                                    color="indigo"
                                />
                                <ActionCard
                                    icon={<BookOpen className="w-5 h-5" />}
                                    title="Manage Courses"
                                    desc="Add or edit courses"
                                    onClick={() => navigate('/dashboard/dashboardProduct')}
                                    color="purple"
                                />
                                <ActionCard
                                    icon={<TrendingUp className="w-5 h-5" />}
                                    title="Revenue"
                                    desc="Track earnings"
                                    onClick={() => navigate('/dashboard')}
                                    color="blue"
                                />
                            </>
                        ) : (
                            <>
                                <ActionCard
                                    icon={<BookOpen className="w-5 h-5" />}
                                    title="Your Courses"
                                    desc="Continue learning"
                                    onClick={() => navigate('/YourCourse')}
                                    color="emerald"
                                />
                                <ActionCard
                                    icon={<GraduationCap className="w-5 h-5" />}
                                    title="Browse Courses"
                                    desc="Explore new courses"
                                    onClick={() => navigate('/')}
                                    color="teal"
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ---------- Sub-components ---------- */

const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-800/50 last:border-0">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
            {icon}
            <span>{label}</span>
        </div>
        <span className="text-sm font-semibold text-slate-200">{value || '—'}</span>
    </div>
)

const ActionCard = ({ icon, title, desc, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="group flex items-center gap-4 p-4 rounded-2xl border border-indigo-500/20 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-0.5 transition-all duration-200 text-left w-full bg-slate-800/50"
        >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors bg-gradient-brand text-white shadow-md shadow-cyan-500/20">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm">{title}</p>
                <p className="text-xs text-slate-400">{desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
        </button>
    )
}

const AdminStatsCard = () => {
    const { data } = useGetCourseHook()
    const totalCourses = data?.courses?.length || 0

    return (
        <div className="bg-slate-900 rounded-2xl shadow-lg shadow-cyan-500/5 border border-indigo-500/20 p-6">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                Admin Overview
            </h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-800/50">
                    <span className="text-sm text-slate-400">Total Courses Created</span>
                    <span className="text-2xl font-black bg-gradient-brand bg-clip-text text-transparent">{totalCourses}</span>
                </div>
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-center">
                    <p className="text-sm text-cyan-400 font-semibold">
                        You have full access to manage courses, modules, and platform analytics.
                    </p>
                </div>
            </div>
        </div>
    )
}

const ClientStatsCard = () => {
    const { data } = useGetAllPurchaseCourse()
    const purchasedCount = data?.purchasedCourse?.length || 0

    return (
        <div className="bg-slate-900 rounded-2xl shadow-lg shadow-cyan-500/5 border border-indigo-500/20 p-6">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-cyan-400" />
                Learning Progress
            </h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-800/50">
                    <span className="text-sm text-slate-400">Courses Purchased</span>
                    <span className="text-2xl font-black bg-gradient-brand bg-clip-text text-transparent">{purchasedCount}</span>
                </div>
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-center">
                    <p className="text-sm text-cyan-400 font-semibold">
                        {purchasedCount > 0
                            ? 'Keep up the great work! Continue your learning journey.'
                            : 'Start learning today by exploring our course catalog!'}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Profile
