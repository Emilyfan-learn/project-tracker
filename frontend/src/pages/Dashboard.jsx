/**
 * Dashboard Home Page Component
 */
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: { total: 0, active: 0 },
    wbs: { total: 0, completed: 0, inProgress: 0, notStarted: 0 },
    pending: { total: 0, open: 0, replied: 0 },
    issues: { total: 0, open: 0, inProgress: 0, resolved: 0 },
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch all stats in parallel
      const [projectsRes, wbsRes, pendingRes, issuesRes] = await Promise.all([
        api.get('/projects/'),
        api.get('/wbs/'),
        api.get('/pending/'),
        api.get('/issues/'),
      ])

      // Calculate project stats
      const activeProjects = projectsRes.items?.filter(
        (p) => p.status === 'Active' || p.status === '進行中'
      ).length || 0

      // Calculate WBS stats
      const completedWBS = wbsRes.items?.filter((w) => w.status === '已完成').length || 0
      const inProgressWBS = wbsRes.items?.filter((w) => w.status === '進行中').length || 0
      const notStartedWBS = wbsRes.items?.filter((w) => w.status === '未開始').length || 0

      // Calculate pending stats
      const openPending = pendingRes.items?.filter((p) => p.status === 'Open').length || 0
      const repliedPending = pendingRes.items?.filter((p) => p.status === 'Replied').length || 0

      // Calculate issue stats
      const openIssues = issuesRes.items?.filter((i) => i.status === 'Open').length || 0
      const inProgressIssues = issuesRes.items?.filter((i) => i.status === 'In Progress').length || 0
      const resolvedIssues = issuesRes.items?.filter((i) => i.status === 'Resolved' || i.status === 'Closed').length || 0

      setStats({
        projects: {
          total: projectsRes.total || 0,
          active: activeProjects,
        },
        wbs: {
          total: wbsRes.total || 0,
          completed: completedWBS,
          inProgress: inProgressWBS,
          notStarted: notStartedWBS,
        },
        pending: {
          total: pendingRes.total || 0,
          open: openPending,
          replied: repliedPending,
        },
        issues: {
          total: issuesRes.total || 0,
          open: openIssues,
          inProgress: inProgressIssues,
          resolved: resolvedIssues,
        },
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, subtitle, color, link }) => (
    <Link
      to={link}
      className={`bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200`}
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="mt-1">
              <div className={`text-3xl font-semibold ${color}`}>{value}</div>
              {subtitle && <div className="text-sm text-gray-600 mt-1">{subtitle}</div>}
            </dd>
          </div>
        </div>
      </div>
    </Link>
  )

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">載入中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">歡迎使用專案追蹤管理系統</h2>
          <p className="text-gray-600">輕量化的個人專案追蹤管理系統</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Projects */}
          <StatCard
            title="專案總數"
            value={stats.projects.total}
            subtitle={`${stats.projects.active} 個進行中`}
            color="text-blue-600"
            link="/projects"
          />

          {/* WBS */}
          <StatCard
            title="WBS 項目"
            value={stats.wbs.total}
            subtitle={`${stats.wbs.completed} 已完成 / ${stats.wbs.inProgress} 進行中`}
            color="text-green-600"
            link="/wbs"
          />

          {/* Pending Items */}
          <StatCard
            title="待辦事項"
            value={stats.pending.total}
            subtitle={`${stats.pending.open} 待處理`}
            color="text-orange-600"
            link="/pending"
          />

          {/* Issues */}
          <StatCard
            title="問題追蹤"
            value={stats.issues.total}
            subtitle={`${stats.issues.open} 待解決 / ${stats.issues.inProgress} 處理中`}
            color="text-red-600"
            link="/issues"
          />
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* WBS Progress */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">WBS 進度分佈</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">已完成</span>
                    <span className="font-semibold text-green-600">{stats.wbs.completed}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${stats.wbs.total > 0 ? (stats.wbs.completed / stats.wbs.total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">進行中</span>
                    <span className="font-semibold text-blue-600">{stats.wbs.inProgress}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${stats.wbs.total > 0 ? (stats.wbs.inProgress / stats.wbs.total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">未開始</span>
                    <span className="font-semibold text-gray-600">{stats.wbs.notStarted}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gray-400 h-2 rounded-full"
                      style={{
                        width: `${stats.wbs.total > 0 ? (stats.wbs.notStarted / stats.wbs.total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">快速操作</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/projects"
                  className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                >
                  專案管理
                </Link>
                <Link
                  to="/wbs"
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  WBS 管理
                </Link>
                <Link
                  to="/pending"
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  待辦清單
                </Link>
                <Link
                  to="/issues"
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  問題追蹤
                </Link>
                <Link
                  to="/gantt"
                  className="col-span-2 flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  檢視甘特圖
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
