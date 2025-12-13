/**
 * WBS List Page Component
 */
import React, { useState, useEffect } from 'react'
import { useWBS } from '../hooks/useWBS'
import WBSForm from '../components/WBSForm'

const WBSList = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [projectId, setProjectId] = useState('PRJ001') // Default project
  const [filters, setFilters] = useState({
    status: '',
  })

  const {
    wbsList,
    loading,
    error,
    total,
    fetchWBS,
    createWBS,
    updateWBS,
    deleteWBS,
  } = useWBS()

  useEffect(() => {
    fetchWBS({ project_id: projectId, ...filters })
  }, [fetchWBS, projectId, filters])

  const handleCreate = () => {
    setEditingItem(null)
    setShowForm(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleDelete = async (item) => {
    if (window.confirm(`確定要刪除 WBS 項目「${item.task_name}」嗎？`)) {
      try {
        await deleteWBS(item.item_id)
        alert('刪除成功')
      } catch (err) {
        alert(`刪除失敗: ${err.message}`)
      }
    }
  }

  const handleSubmit = async (formData) => {
    try {
      if (editingItem) {
        await updateWBS(editingItem.item_id, formData)
        alert('更新成功')
      } else {
        await createWBS(formData)
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

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case '已完成':
        return 'bg-green-100 text-green-800'
      case '進行中':
        return 'bg-blue-100 text-blue-800'
      case '未開始':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getProgressColor = (variance) => {
    if (variance > 0) return 'text-green-600'
    if (variance < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <WBSForm
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
          <h1 className="text-3xl font-bold text-gray-900">WBS 項目管理</h1>
          <button onClick={handleCreate} className="btn-primary">
            + 新增 WBS
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center">
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
              <option value="未開始">未開始</option>
              <option value="進行中">進行中</option>
              <option value="已完成">已完成</option>
            </select>
          </div>

          <div className="mt-6">
            <button
              onClick={() => fetchWBS({ project_id: projectId, ...filters })}
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

      {/* WBS List */}
      {!loading && (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    WBS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    任務名稱
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    負責單位
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    預計結束
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    進度
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    狀態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {wbsList.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      暫無資料
                    </td>
                  </tr>
                ) : (
                  wbsList.map((item) => (
                    <tr key={item.item_id} className={item.is_overdue ? 'bg-red-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.wbs_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.task_name}
                        {item.is_overdue && (
                          <span className="ml-2 text-red-500">⚠️</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.owner_unit || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.original_planned_end || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${item.actual_progress}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-900">{item.actual_progress}%</span>
                          {item.progress_variance !== 0 && (
                            <span className={`ml-2 ${getProgressColor(item.progress_variance)}`}>
                              ({item.progress_variance > 0 ? '+' : ''}{item.progress_variance})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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

export default WBSList
