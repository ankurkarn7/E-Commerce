import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='flex flex-col gap-3 justify-center items-center mt-32'>
      <p className='text-7xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>404</p>
      <p className='text-xl text-slate-600'>Page not found</p>
      <Link to='/' className='mt-2 bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-700 active:scale-95 transition shadow-sm'>Back to Home</Link>
    </div>
  )
}

export default NotFound
