import { useState } from 'react'
import TestComponent from '@/components/TestComponent'
import UILibrariesTest from '@/components/UILibrariesTest'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema de Citas Médicas
          </h1>
          <p className="text-lg text-gray-600">
            Proyecto React con TypeScript, Vite y Tailwind CSS
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-center">
            <button 
              onClick={() => setCount((count) => count + 1)}
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Contador: {count}
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <TestComponent />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <UILibrariesTest />
        </div>
      </div>
    </div>
  )
}

export default App
