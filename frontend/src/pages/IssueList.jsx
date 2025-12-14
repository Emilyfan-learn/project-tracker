/**
 * Issue List Page Component
 */
import React, { useState, useEffect } from 'react'
import { useIssues } from '../hooks/useIssues'
import IssueForm from '../components/IssueForm'

const IssueList = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [projectId, setProjectId] = useState('PRJ001')
  const [filters, setFilters] = useState({
    status: '',
    severity: '',
    priority: '',
  })

  const {
    issuesList,
    loading,
    error,
    total,
    fetchIssues,
    createIssue,
    updateIssue,
    deleteIssue,
    escalateIssue,
    resolveIssue,
    closeIssue,
  } = useIssues()

  useEffect(() => {
    fetchIssues({ project_id: projectId, ...filters })
  }, [fetchIssues, projectId, filters])

  const handleCreate = () => {
    setEditingItem(null)
    setShowForm(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleDelete = async (item) => {
    if (window.confirm(`確定要刪除問題「${item.issue_title}」嗎？`)) {
      try {
        await deleteIssue(item.issue_id)
        alert('刪除成功')
      } catch (err) {
        alert(`刪除失敗: ${err.message}`)
      }
    }
  }

  const handleSubmit = async (formData) => {
    try {
      if (editingItem) {
        await updateIssue(editingItem.issue_id, formData)
        alert('更新成功')
      } else {
        await createIssue(formData)
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

  const handleEscalate = async (issueId) => {
    const level = prompt('請輸入升級層級 (PM/Senior Manager/Executive):')
    const reason = prompt('請輸入升級原因:')
    const changedBy = prompt('請輸入您的姓名:')

    if (level && reason && changedBy) {
      try {
        await escalateIssue(issueId, { escalation_level: level, escalation_reason: reason, changed_by: changedBy })
        alert('升級成功')
      } catch (err) {
        alert(`升級失敗: ${err.message}`)
      }
    }
  }

  const handleResolve = async (issueId) => {
    const resolution = prompt('請輸入解決方案:')
    const resolvedBy = prompt('請輸入您的姓名:')

    if (resolution && resolvedBy) {
      try {
        await resolveIssue(issueId, { resolution, resolved_by: resolvedBy })
        alert('已標記為已解決')
      } catch (err) {
        alert(`標記失敗: ${err.message}`)
      }
    }
  }

  const handleClose = async (issueId) => {
    const closedBy = prompt('請輸入您的姓名:')

    if (closedBy) {
      try {
        await closeIssue(issueId, { closed_by: closedBy })
        alert('已關閉問題')
      } catch (err) {
        alert(`關閉失敗: ${err.message}`)
      }
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800'
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'Pending':
        return 'bg-orange-100 text-orange-800'
      case 'Resolved':
        return 'bg-green-100 text-green-800'
      case 'Closed':
        return 'bg-gray-100 text-gray-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityBadgeColor = (severity) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-600 text-white'
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

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-600 text-white'
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

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <IssueForm
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
          <h1 className="text-3xl font-bold text-gray-900">問題追蹤管理</h1>
          <button onClick={handleCreate} className="btn-primary">
            + 新增問題
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
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label htmlFor="severity-filter" className="label">
              嚴重性
            </label>
            <select
              id="severity-filter"
              value={filters.severity}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
              className="input-field"
            >
              <option value="">全部</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
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
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="mt-6">
            <button
              onClick={() => fetchIssues({ project_id: projectId, ...filters })}
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

      {/* Issue List */}
      {!loading && (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    編號
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    問題標題
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    類型
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    嚴重性
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    優先級
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    指派給
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    狀態
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {issuesList.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                      暫無資料
                    </td>
                  </tr>
                ) : (
                  issuesList.map((item) => (
                    <tr key={item.issue_id} className={item.is_overdue ? 'bg-red-50' : ''}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.issue_number}
                        {item.is_escalated && (
                          <span className="ml-2 text-orange-500">⬆️</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {item.issue_title}
                        {item.is_overdue && (
                          <span className="ml-2 text-red-500">⚠️</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.issue_type}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityBadgeColor(
                            item.severity
                          )}`}
                        >
                          {item.severity}
                        </span>
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
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.assigned_to || '-'}
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
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-primary-600 hover:text-primary-900"
                            title="編輯"
                          >
                            編輯
                          </button>
                          {item.status !== 'Resolved' && item.status !== 'Closed' && (
                            <>
                              <button
                                onClick={() => handleEscalate(item.issue_id)}
                                className="text-orange-600 hover:text-orange-900"
                                title="升級"
                              >
                                升級
                              </button>
                              <button
                                onClick={() => handleResolve(item.issue_id)}
                                className="text-green-600 hover:text-green-900"
                                title="解決"
                              >
                                解決
                              </button>
                            </>
                          )}
                          {item.status === 'Resolved' && item.status !== 'Closed' && (
                            <button
                              onClick={() => handleClose(item.issue_id)}
                              className="text-gray-600 hover:text-gray-900"
                              title="關閉"
                            >
                              關閉
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(item)}
                            className="text-red-600 hover:text-red-900"
                            title="刪除"
                          >
                            刪除
                          </button>
                        </div>
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

export default IssueList
