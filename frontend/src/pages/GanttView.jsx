/**
 * Gantt Chart View Page
 */
import React, { useState, useEffect } from 'react'
import { useWBS } from '../hooks/useWBS'
import GanttChart from '../components/GanttChart'

const GanttView = () => {
  const [projectId, setProjectId] = useState('PRJ001')
  const [viewMode, setViewMode] = useState('Day')
  const [selectedTask, setSelectedTask] = useState(null)
  const [showTaskDetail, setShowTaskDetail] = useState(false)

  const { wbsList, loading, error, fetchWBS } = useWBS()

  useEffect(() => {
    if (projectId) {
      fetchWBS({ project_id: projectId, limit: 1000 })
    }
  }, [projectId, fetchWBS])

  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setShowTaskDetail(true)
  }

  const handleDateChange = async (taskId, start, end) => {
    console.log('Date changed:', taskId, start, end)
    // TODO: Implement date change API call
    alert(`任務 ${taskId} 日期已更改:\n開始: ${start.toLocaleDateString('zh-TW')}\n結束: ${end.toLocaleDateString('zh-TW')}`)
  }

  const viewModes = [
    { value: 'Quarter Day', label: '季日' },
    { value: 'Half Day', label: '半日' },
    { value: 'Day', label: '日' },
    { value: 'Week', label: '週' },
    { value: 'Month', label: '月' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">甘特圖視圖</h1>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow">
          {/* Project Selection */}
          <div>
            <label htmlFor="project-select" className="label">
              專案 ID
            </label>
            <input
              id="project-select"
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="input-field"
              placeholder="請輸入專案 ID"
            />
          </div>

          {/* View Mode Selection */}
          <div>
            <label htmlFor="view-mode" className="label">
              檢視模式
            </label>
            <select
              id="view-mode"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="input-field"
            >
              {viewModes.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reload Button */}
          <div className="mt-6">
            <button
              onClick={() => fetchWBS({ project_id: projectId, limit: 1000 })}
              className="btn-secondary"
              disabled={loading}
            >
              {loading ? '載入中...' : '重新載入'}
            </button>
          </div>

          {/* Stats */}
          <div className="ml-auto text-sm text-gray-600">
            共 {wbsList.length} 個任務
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">載入中...</p>
        </div>
      )}

      {/* Gantt Chart */}
      {!loading && wbsList.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <GanttChart
            tasks={wbsList}
            viewMode={viewMode}
            onTaskClick={handleTaskClick}
            onDateChange={handleDateChange}
          />
        </div>
      )}

      {/* No Data */}
      {!loading && wbsList.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
          <p className="text-lg">暫無 WBS 資料</p>
          <p className="mt-2 text-sm">請先建立 WBS 項目或選擇其他專案</p>
        </div>
      )}

      {/* Task Detail Modal */}
      {showTaskDetail && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">任務詳情</h2>
                <button
                  onClick={() => setShowTaskDetail(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">WBS ID</label>
                    <p className="text-gray-900">{selectedTask.wbs_id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">任務名稱</label>
                    <p className="text-gray-900">{selectedTask.task_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">負責人</label>
                    <p className="text-gray-900">{selectedTask.responsible_person || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">狀態</label>
                    <p className="text-gray-900">{selectedTask.status || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">預計開始</label>
                    <p className="text-gray-900">{selectedTask.original_planned_start || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">預計結束</label>
                    <p className="text-gray-900">{selectedTask.original_planned_end || '-'}</p>
                  </div>
                  {selectedTask.revised_planned_start && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">調整後開始</label>
                      <p className="text-blue-600">{selectedTask.revised_planned_start}</p>
                    </div>
                  )}
                  {selectedTask.revised_planned_end && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">調整後結束</label>
                      <p className="text-blue-600">{selectedTask.revised_planned_end}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">實際進度</label>
                    <p className="text-gray-900">{selectedTask.actual_progress || 0}%</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">預估進度</label>
                    <p className="text-gray-900">{selectedTask.estimated_progress || 0}%</p>
                  </div>
                  {selectedTask.variance_progress !== null && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">進度差異</label>
                      <p className={selectedTask.variance_progress < 0 ? 'text-red-600' : 'text-green-600'}>
                        {selectedTask.variance_progress > 0 ? '+' : ''}{selectedTask.variance_progress}%
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowTaskDetail(false)}
                  className="btn-secondary"
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GanttView
