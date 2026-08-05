import CourseSection from '@/components/CourseSection'
import SearchResult from '@/components/SearchResult'
import RecommendedCourses from '@/components/RecommendedCourses'
import { useUserStore } from '@/Store/user.store.jsx'
import React, { useState } from 'react'

const Home = () => {
    const { user } = useUserStore()
    const isAdmin = user?.user?.admin
    const [SearchInput, setSearchInput] = useState('')
    const [ActiveSearch, setActiveSearch] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        setActiveSearch(SearchInput)
    }

    const resetFilter = () => {
        setSearchInput("")
        setActiveSearch("")
    }

    return (
        <div className='min-h-screen bg-slate-950'>
            <SearchResult
                SearchInput={SearchInput}
                setSearchInput={setSearchInput}
                handleSubmit={handleSubmit}
                onReset={resetFilter}
                hasActiveSearch={!!ActiveSearch}  // ✅ Fixed: ActiveSearch not SearchInput
            />
            {!ActiveSearch && !isAdmin && <RecommendedCourses />}
            <CourseSection ActiveSearch={ActiveSearch} />
        </div>
    )
}

export default Home

