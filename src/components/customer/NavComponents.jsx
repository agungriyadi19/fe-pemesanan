import React from 'react'

const NavComponents = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <a href="#home" className="text-white text-lg font-bold">
          <strong>Warmindo</strong> 
        </a>
        <button className="text-white lg:hidden">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <div className="hidden lg:flex lg:items-center lg:space-x-4">
          <a href="#riwayat" className="text-white hover:text-gray-400">
            Riwayat
          </a>
        </div>
      </div>
    </nav>
  )
}

export default NavComponents
