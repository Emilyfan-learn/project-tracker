import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import ProjectList from './pages/ProjectList'
import WBSList from './pages/WBSList'
import PendingList from './pages/PendingList'
import IssueList from './pages/IssueList'
import GanttView from './pages/GanttView'

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
                <Link to="/projects" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  專案管理
                </Link>
                <Link to="/wbs" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  WBS 管理
                </Link>
                <Link to="/pending" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  待辦清單
                </Link>
                <Link to="/issues" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  問題追蹤
                </Link>
                <Link to="/gantt" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  甘特圖
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
                      <div className="flex gap-4 justify-center flex-wrap">
                        <Link to="/projects" className="btn-primary inline-block">
                          專案管理
                        </Link>
                        <Link to="/wbs" className="btn-secondary inline-block">
                          WBS 管理
                        </Link>
                        <Link to="/pending" className="btn-secondary inline-block">
                          待辦清單
                        </Link>
                        <Link to="/issues" className="btn-secondary inline-block">
                          問題追蹤
                        </Link>
                        <Link to="/gantt" className="btn-secondary inline-block">
                          甘特圖
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            } />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/wbs" element={<WBSList />} />
            <Route path="/pending" element={<PendingList />} />
            <Route path="/issues" element={<IssueList />} />
            <Route path="/gantt" element={<GanttView />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
