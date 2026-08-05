import { useGetDailyData, useGetDataHook } from '@/hooks/analytic.hook'
import React, { useMemo } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const DashboardAnalytics = () => {
  const { data } = useGetDataHook()

  const { startDate, endDate } = useMemo(() => {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - 6); // last 7 days
    end.setDate(end.getDate() + 2)
    const toStr = (d) => d.toISOString().split('T')[0]

    return {
      startDate: toStr(start),
      endDate: toStr(end),
    }
  }, [])

  const { data: dailyData, isLoading } = useGetDailyData(startDate, endDate)

  return (
    <div className="min-h-screen bg-slate-950 p-8 space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black bg-gradient-brand bg-clip-text text-transparent">Analytics Overview</h1>
        <p className="text-slate-400 mt-1">
          Track platform performance & revenue
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard title="Total Courses" value={data?.courses} />
        <StatCard title="Enrollments" value={data?.totalEntrollments} />
        <StatCard title="Revenue" value={`₹ ${data?.totalRevenue}`} />
        <StatCard title="Users" value={data?.users} />
      </div>

      {/* Chart Section */}
      <div className="bg-slate-900 rounded-2xl shadow-2xl shadow-cyan-500/10 border border-indigo-500/20 p-6 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h2 className="text-xl font-bold text-white">
              Revenue Trend
            </h2>
            <p className="text-sm text-slate-400">
              Last 7 days performance
            </p>
          </div>
        </div>

        {isLoading ? (
          <ChartSkeleton />
        ) : (
          <div className="h-[55vh] relative z-10 overflow-visible">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData || []}>
                <defs>
                  <linearGradient id="brandGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e293b" strokeDasharray="4 4" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 13 }}
                  dy={10}
                />
                <YAxis
                  stroke="#64748b"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 13 }}
                  dx={-10}
                />
                <Tooltip
                  cursor={{ stroke: '#334155', strokeWidth: 2, strokeDasharray: '4 4' }}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(6, 182, 212, 0.2)',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#06b6d4', fontWeight: 'bold' }}
                  formatter={(value) => [`₹ ${value}`, 'Revenue']}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="url(#brandGradient)"
                  strokeWidth={4}
                  dot={{ r: 4, fill: '#0f172a', stroke: '#06b6d4', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#06b6d4', stroke: '#0f172a', strokeWidth: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardAnalytics


const StatCard = ({ title, value }) => (
  <div className="group bg-slate-900 rounded-2xl shadow-lg p-6 border border-indigo-500/20 hover:border-cyan-500/50 hover:shadow-cyan-500/10 transition-all duration-300 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    <p className="text-sm font-semibold text-slate-400 relative z-10">{title}</p>
    <h2 className="text-3xl font-black bg-gradient-brand bg-clip-text text-transparent mt-3 relative z-10">
      {value ?? '-'}
    </h2>
  </div>
)

const ChartSkeleton = () => (
  <div className="h-[55vh] flex items-center justify-center">
    <div className="animate-pulse w-full h-full bg-slate-800/50 rounded-xl border border-slate-700/50" />
  </div>
)
