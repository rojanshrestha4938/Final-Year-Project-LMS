import DashboardSideBar from '@/components/DashboardSidebar'
import { useUserStore } from '@/Store/user.store.jsx'
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const Dashboard = () => {
  const { user } = useUserStore()

  // Redirect non-admin users to home
  if (!user?.user?.admin) {
    return <Navigate to="/" replace />
  }

  return (
    <div className='flex min-h-screen bg-slate-50'>
      <DashboardSideBar />
      <main className='flex-1'>
        <Outlet />
      </main>
    </div>
  )
}

export default Dashboard
