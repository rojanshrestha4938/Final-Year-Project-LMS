import React from 'react'
import { Search, X } from 'lucide-react'

const SearchResult = ({
    SearchInput,
    setSearchInput,
    handleSubmit,
    onReset,
    hasActiveSearch
}) => {

    const SearchText = [
        'MERN Stack Development',
        'Python for Beginners',
        'Advanced JavaScript',
        'AI & Machine Learning'
    ]

    return (
        <div className='min-h-[28vh] bg-slate-900 border-b border-indigo-500/20 relative overflow-hidden flex items-center'>
            {/* Background glowing orb */}
            <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-brand opacity-10 blur-[100px] rounded-full pointer-events-none"></div>
            <div className='max-w-4xl mx-auto px-6 w-full flex flex-col items-center gap-6'>

                {/* Search Bar */}
                <form
                    onSubmit={handleSubmit}
                    className='w-full max-w-2xl flex items-center gap-4 justify-center'
                >
                    <div className='relative flex-1'>
                        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500' />

                        <input
                            value={SearchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            type="text"
                            placeholder='Search courses...'
                            className='w-full pl-10 pr-10 py-3 bg-slate-800/50 backdrop-blur-md border border-indigo-500/30 text-white rounded-xl
              focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none focus:glow-brand
              transition-all text-base placeholder-slate-400'
                        />

                        {SearchInput && (
                            <button
                                type='button'
                                onClick={() => setSearchInput('')}
                                className='absolute right-3 top-1/2 -translate-y-1/2 p-1 
                hover:bg-zinc-100 rounded-lg transition-colors'
                            >
                                <X className='w-4 h-4 text-zinc-500 hover:text-zinc-700' />
                            </button>
                        )}
                    </div>

                    <button
                        type='submit'
                        className='px-6 py-3 bg-gradient-brand hover:brightness-110 text-white shadow-lg shadow-blue-500/30
            font-bold rounded-xl transition-all text-sm'
                    >
                        Search
                    </button>
                </form>

                {/* Quick Tags */}
                <div className='flex flex-wrap justify-center gap-3'>
                    {SearchText.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => setSearchInput(item)}
                            className='px-4 py-2 bg-slate-800/50 hover:bg-slate-800 
              border border-indigo-500/30 rounded-lg text-sm font-medium 
              text-slate-300 hover:text-white transition-colors backdrop-blur-sm shadow-sm hover:glow-brand'
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {/* Reset */}
                {hasActiveSearch && (
                    <button
                        onClick={onReset}
                        className='px-4 py-2 bg-slate-800/80 hover:bg-slate-700 
            text-slate-300 font-medium text-sm rounded-lg 
            border border-indigo-500/30 transition-colors'
                    >
                        Reset filter
                    </button>
                )}

            </div>
        </div>
    )
}

export default SearchResult
