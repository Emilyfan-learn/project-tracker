import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import WBSList from './pages/WBSList'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">
                Project Tracker
              </h1>
              <nav className="flex space-x-4">
                <Link to="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  首頁
                </Link>
                <Link to="/wbs" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  WBS 管理
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/" element={
              <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                  <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                        歡迎使用專案追蹤管理系統
                      </h2>
                      <p className="text-gray-500 mb-4">
                        輕量化的個人專案追蹤管理系統
                      </p>
                      <Link to="/wbs" className="btn-primary inline-block">
                        前往 WBS 管理
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            } />
            <Route path="/wbs" element={<WBSList />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
