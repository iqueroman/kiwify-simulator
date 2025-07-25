import React from 'react'
import type { FormStep } from '../types'

interface ProgressBarProps {
  steps: FormStep[]
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps }) => {
  return (
    <div className="w-full bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-6">
      {/* Mobile Layout */}
      <div className="block sm:hidden">
        <div className="flex items-center justify-center mb-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0
                    ${step.isCompleted 
                      ? 'bg-[var(--color-green)] text-white' 
                      : step.isActive 
                        ? 'bg-[var(--color-green-light)] text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }
                  `}
                >
                  {step.isCompleted ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${step.isCompleted ? 'bg-[var(--color-green)]' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
        {/* Current step title for mobile */}
        <div className="text-center">
          <span className="text-sm font-medium text-[var(--color-green)]">
            {steps.find(step => step.isActive)?.title}
          </span>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0
                  ${step.isCompleted 
                    ? 'bg-[var(--color-green)] text-white' 
                    : step.isActive 
                      ? 'bg-[var(--color-green-light)] text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }
                `}
              >
                {step.isCompleted ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <span className={`ml-3 text-sm font-medium ${step.isActive ? 'text-[var(--color-green)]' : 'text-gray-600'}`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-4 ${step.isCompleted ? 'bg-[var(--color-green)]' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default ProgressBar