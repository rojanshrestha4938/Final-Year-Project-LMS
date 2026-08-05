import { useCreateCouseHook, useGetCourseHook } from '@/hooks/Course.hook'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useForm } from 'react-hook-form'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const DashboardProducts = () => {
  const { data } = useGetCourseHook()
  const navigate = useNavigate()
  const { register, handleSubmit, reset: resetForm } = useForm()
  const { mutate, isPending, isError, error } = useCreateCouseHook()
  const [openModule, setOpenModule] = useState(false)

  const getCourseId = (id) => {
    navigate(`/dashboard/CourseModule/${id}`)
  }

  const createCourseHandler = (data) => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('amount', data.amount)
    formData.append('thumbnail', data.thumbnail[0])

    mutate(formData, {
      onSuccess: (res) => {
        toast.success(res.message)
        setOpenModule(false)
        resetForm()
      }
    })
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black bg-gradient-brand bg-clip-text text-transparent">Courses</h1>

        <Dialog open={openModule} onOpenChange={setOpenModule}>
          <DialogTrigger
            disabled={isPending}
            className="px-5 py-2 bg-gradient-brand text-white rounded-lg font-bold shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all"
          >
            + Add Course
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg bg-slate-900 border-indigo-500/30 text-white shadow-2xl shadow-cyan-500/20">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white mb-2">Add New Course</DialogTitle>
              <DialogDescription asChild>
                <form
                  onSubmit={handleSubmit(createCourseHandler)}
                  className="mt-6 space-y-4"
                >
                  <input
                    {...register("title")}
                    placeholder="Course Title"
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />

                  <textarea
                    {...register("description")}
                    placeholder="Course Description"
                    rows={3}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                  />

                  <input
                    type="number"
                    {...register("amount")}
                    placeholder="Price"
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />

                  <input
                    type="file"
                    accept="image/*"
                    {...register("thumbnail")}
                    className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/10 file:text-cyan-400 hover:file:bg-indigo-500/20 cursor-pointer"
                  />

                  {/* Inline Error */}
                  {isError && (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/40 text-red-400 text-sm rounded-lg px-4 py-3">
                      <span>⚠️</span>
                      <span>{error?.response?.data?.message || 'Failed to create course. Please try again.'}</span>
                    </div>
                  )}

                  <button
                    disabled={isPending}
                    type="submit"
                    className="w-full py-3 mt-4 bg-gradient-brand flex items-center justify-center text-white rounded-lg font-bold shadow-md shadow-cyan-500/20 hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {isPending ? <Spinner /> : "Create Course"}
                  </button>
                </form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.courses?.map((item) => (
          <div
            key={item._id}
            onClick={() => getCourseId(item._id)}
            className="cursor-pointer bg-slate-900 rounded-2xl border border-indigo-500/20 hover:border-cyan-500/50 shadow-lg shadow-cyan-500/5 hover:shadow-cyan-500/10 transition-all p-4 group"
          >
            <div className="h-40 flex items-center justify-center bg-slate-800 rounded-xl overflow-hidden relative">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="mt-4">
              <h2 className="font-bold text-lg text-white line-clamp-1 group-hover:text-cyan-400 transition-colors">
                {item.title}
              </h2>
              <p className="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="font-black text-cyan-400 px-3 py-1 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                  ₹ {item.amount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashboardProducts
