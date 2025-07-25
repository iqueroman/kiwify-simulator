import React from 'react'

interface TopbarProps {
  onAdminClick?: () => void
}

const Topbar: React.FC<TopbarProps> = ({ onAdminClick }) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img
              src="https://kiwify.com.br/.netlify/images?url=_astro%2Flogo.0cuMVBav.png"
              alt="Kiwify"
              className="h-8 w-auto"
            />
            <span className="ml-3 text-lg font-semibold text-gray-900">
              Simulador Imobiliário
            </span>
          </div>
          <button 
            onClick={onAdminClick}
            className="bg-[var(--color-accent)] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors"
          >
            Admin Panel
          </button>
        </div>
      </div>
    </div>
  )
}

export default Topbar