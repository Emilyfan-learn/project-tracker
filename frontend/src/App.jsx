import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ProjectList from './pages/ProjectList'
import WBSList from './pages/WBSList'
import WBSTreeView from './pages/WBSTreeView'
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
                <Link to="/wbs/tree" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  WBS 樹狀圖
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
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/wbs" element={<WBSList />} />
            <Route path="/wbs/tree" element={<WBSTreeView />} />
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
