/**
 * Pending Items List Page Component
 */
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePending } from '../hooks/usePending'
import PendingForm from '../components/PendingForm'

const PendingList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [projectId, setProjectId] = useState(searchParams.get('project') || 'PRJ001')
  const [filters, setFilters] = useState({
    status: '',
    source_type: '',
    priority: '',
  })

  const {
    pendingList,
    loading,
    error,
    total,
    fetchPending,
    createPending,
    updatePending,
    deletePending,
    markAsReplied,
  } = usePending()

  useEffect(() => {
    fetchPending({ project_id: projectId, ...filters })
  }, [fetchPending, projectId, filters])

  // Update URL when projectId changes
  useEffect(() => {
    if (projectId) {
      setSearchParams({ project: projectId })
    }
  }, [projectId, setSearchParams])

  const handleCreate = () => {
    setEditingItem(null)
    setShowForm(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleDelete = async (item) => {
    if (window.confirm(`確定要刪除待辦項目「${item.description.substring(0, 30)}...」嗎？`)) {
      try {
        await deletePending(item.pending_id)
        alert('刪除成功')
      } catch (err) {
        alert(`刪除失敗: ${err.message}`)
      }
    }
  }

  const handleSubmit = async (formData) => {
    try {
      if (editingItem) {
        await updatePending(editingItem.pending_id, formData)
        alert('更新成功')
      } else {
        await createPending(formData)
        alert('新增成功')
      }
      setShowForm(false)
      setEditingItem(null)
    } catch (err) {
      alert(`操作失敗: ${err.message}`)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingItem(null)
  }

  const handleMarkReplied = async (pendingId) => {
    try {
      await markAsReplied(pendingId, new Date().toISOString().split('T')[0])
      alert('已標記為已回覆')
    } catch (err) {
      alert(`標記失敗: ${err.message}`)
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case '已完成':
        return 'bg-green-100 text-green-800'
      case '處理中':
        return 'bg-blue-100 text-blue-800'
      case '待處理':
        return 'bg-yellow-100 text-yellow-800'
      case '已取消':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800'
      case 'Medium':
        return 'bg-orange-100 text-orange-800'
      case 'Low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSourceBadgeColor = (sourceType) => {
    switch (sourceType) {
      case '客戶':
        return 'bg-purple-100 text-purple-800'
      case '自己':
        return 'bg-blue-100 text-blue-800'
      case '內部':
        return 'bg-cyan-100 text-cyan-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PendingForm
          initialData={editingItem}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          projectId={projectId}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">待辦清單管理</h1>
          <button onClick={handleCreate} className="btn-primary">
            + 新增待辦項目
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center flex-wrap">
          <div>
            <label htmlFor="project-select" className="label">
              專案
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

          <div>
            <label htmlFor="source-filter" className="label">
              來源
            </label>
            <select
              id="source-filter"
              value={filters.source_type}
              onChange={(e) => setFilters({ ...filters, source_type: e.target.value })}
              className="input-field"
            >
              <option value="">全部</option>
              <option value="客戶">客戶</option>
              <option value="自己">自己</option>
              <option value="內部">內部</option>
            </select>
          </div>

          <div>
            <label htmlFor="status-filter" className="label">
              狀態
            </label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="input-field"
            >
              <option value="">全部</option>
              <option value="待處理">待處理</option>
              <option value="處理中">處理中</option>
              <option value="已完成">已完成</option>
              <option value="已取消">已取消</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority-filter" className="label">
              優先級
            </label>
            <select
              id="priority-filter"
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="input-field"
            >
              <option value="">全部</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="mt-6">
            <button
              onClick={() => fetchPending({ project_id: projectId, ...filters })}
              className="btn-secondary"
            >
              搜尋
            </button>
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

      {/* Pending List */}
      {!loading && (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    任務日期
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    來源
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    說明
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    預計回覆
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    優先級
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    狀態
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    回覆狀態
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingList.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                      暫無資料
                    </td>
                  </tr>
                ) : (
                  pendingList.map((item) => (
                    <tr key={item.pending_id} className={item.is_overdue ? 'bg-red-50' : ''}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.task_date}
                        {item.is_overdue && (
                          <span className="ml-2 text-red-500">⚠️</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSourceBadgeColor(
                            item.source_type
                          )}`}
                        >
                          {item.source_type}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {item.description}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.expected_reply_date || '-'}
                        {item.days_until_due !== null && item.days_until_due < 0 && (
                          <span className="ml-2 text-red-600 text-xs">
                            (逾期 {Math.abs(item.days_until_due)} 天)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeColor(
                            item.priority
                          )}`}
                        >
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {item.is_replied ? (
                          <span className="text-green-600">✓ 已回覆</span>
                        ) : (
                          <button
                            onClick={() => handleMarkReplied(item.pending_id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            標記已回覆
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-primary-600 hover:text-primary-900 mr-3"
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="text-red-600 hover:text-red-900"
                        >
                          刪除
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-4 text-sm text-gray-600">
            共 {total} 筆資料
          </div>
        </>
      )}
    </div>
  )
}

export default PendingList
