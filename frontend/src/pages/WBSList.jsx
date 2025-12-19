/**
 * WBS List Page Component
 */
import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useWBS } from '../hooks/useWBS'
import { useExcel } from '../hooks/useExcel'
import { useProjects } from '../hooks/useProjects'
import { useIssues } from '../hooks/useIssues'
import WBSForm from '../components/WBSForm'

const WBSList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [projectId, setProjectId] = useState(searchParams.get('project') || 'PRJ001')
  const [filters, setFilters] = useState({
    status: '',
    parent_wbs_id: '', // 新增父WBS ID篩選
  })
  const [smartFilters, setSmartFilters] = useState({
    myResponsibility: false,
    clientResponsibility: false,
    internalOnly: false,
    overdueOnly: false,
    dueThisWeek: false,
  })
  const [myUsername, setMyUsername] = useState('') // For "my responsibility" filter
  const [successMessage, setSuccessMessage] = useState('')
  const [continueAdding, setContinueAdding] = useState(false) // 用於連續新增
  const fileInputRef = useRef(null)

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

  const {
    loading: excelLoading,
    error: excelError,
    importWBSFromExcel,
    exportWBSToExcel,
    downloadWBSTemplate,
  } = useExcel()

  const {
    projectsList,
    fetchProjects,
  } = useProjects()

  const {
    issuesList,
    fetchIssues,
  } = useIssues()

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  useEffect(() => {
    if (projectId) {
      fetchIssues({ project_id: projectId, limit: 1000 })
    }
  }, [fetchIssues, projectId])

  useEffect(() => {
    fetchWBS({ project_id: projectId, ...filters })
  }, [fetchWBS, projectId, filters])

  // Update URL when projectId changes
  useEffect(() => {
    if (projectId) {
      setSearchParams({ project: projectId })
    }
  }, [projectId, setSearchParams])

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

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
        // Refresh the WBS list
        fetchWBS({ project_id: projectId, ...filters })
      } catch (err) {
        alert(`刪除失敗: ${err.message}`)
      }
    }
  }

  const handleSubmit = async (formData) => {
    try {
      if (editingItem) {
        await updateWBS(editingItem.item_id, formData)
        setSuccessMessage('更新成功')
        setShowForm(false)
        setEditingItem(null)
        setContinueAdding(false)
      } else {
        await createWBS(formData)
        setSuccessMessage('新增成功')
        // 如果是新增，保持在表單頁面以繼續新增
        setEditingItem(null)
        setContinueAdding(true)
        // 不關閉表單，讓用戶可以繼續新增
      }
      // Refresh the WBS list to show the new/updated item
      fetchWBS({ project_id: projectId, ...filters })
    } catch (err) {
      alert(`操作失敗: ${err.message}`)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingItem(null)
    setContinueAdding(false)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!projectId) {
      alert('請先選擇專案')
      return
    }

    try {
      const result = await importWBSFromExcel(file, projectId)
      setSuccessMessage(
        `匯入成功！成功匯入 ${result.imported} 筆，失敗 ${result.failed} 筆`
      )

      // Refresh WBS list
      await fetchWBS({ project_id: projectId, ...filters })

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      alert(`匯入失敗: ${err.message}`)
    }
  }

  const handleExport = async () => {
    if (!projectId) {
      alert('請先選擇專案')
      return
    }

    try {
      await exportWBSToExcel(projectId)
      setSuccessMessage('匯出成功！')
    } catch (err) {
      alert(`匯出失敗: ${err.message}`)
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      await downloadWBSTemplate()
      setSuccessMessage('範本下載成功！')
    } catch (err) {
      alert(`下載範本失敗: ${err.message}`)
    }
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

  // Build hierarchy structure with indentation levels
  const buildHierarchy = (items) => {
    // Create a map for quick lookup
    const itemMap = new Map()
    items.forEach(item => {
      itemMap.set(item.wbs_id, { ...item, level: 0, children: [] })
    })

    // Calculate hierarchy levels
    const calculateLevel = (wbsId, visited = new Set()) => {
      if (visited.has(wbsId)) return 0 // Prevent circular references
      visited.add(wbsId)

      const item = itemMap.get(wbsId)
      if (!item || !item.parent_id) return 0

      const parent = itemMap.get(item.parent_id)
      if (!parent) return 0

      return calculateLevel(item.parent_id, visited) + 1
    }

    // Set levels for all items
    items.forEach(item => {
      const itemWithLevel = itemMap.get(item.wbs_id)
      if (itemWithLevel) {
        itemWithLevel.level = calculateLevel(item.wbs_id)
      }
    })

    // Sort by parent first, then by WBS ID
    return Array.from(itemMap.values()).sort((a, b) => {
      // Extract parent WBS ID from item_id format
      const getParentWbsId = (item) => {
        if (!item.parent_id) return ''
        return item.parent_id.includes('_') ? item.parent_id.split('_')[1] : item.parent_id
      }

      const aParent = getParentWbsId(a) || ''
      const bParent = getParentWbsId(b) || ''

      // First sort by parent
      if (aParent !== bParent) {
        if (!aParent) return -1 // Items without parent come first
        if (!bParent) return 1

        const aParentParts = aParent.split('.').map(Number)
        const bParentParts = bParent.split('.').map(Number)

        for (let i = 0; i < Math.max(aParentParts.length, bParentParts.length); i++) {
          const aNum = aParentParts[i] || 0
          const bNum = bParentParts[i] || 0
          if (aNum !== bNum) return aNum - bNum
        }
      }

      // Then sort by WBS ID
      const aParts = a.wbs_id.split('.').map(Number)
      const bParts = b.wbs_id.split('.').map(Number)

      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aNum = aParts[i] || 0
        const bNum = bParts[i] || 0
        if (aNum !== bNum) return aNum - bNum
      }
      return 0
    })
  }

  // Apply smart filters to WBS list
  const getFilteredWBSList = () => {
    let filtered = [...wbsList]

    // Filter: Parent WBS ID
    if (filters.parent_wbs_id) {
      filtered = filtered.filter((item) => {
        if (!item.parent_id) return false
        const parentWbsId = item.parent_id.includes('_')
          ? item.parent_id.split('_')[1]
          : item.parent_id
        return parentWbsId === filters.parent_wbs_id
      })
    }

    // Filter: Only my responsibility
    if (smartFilters.myResponsibility && myUsername) {
      filtered = filtered.filter(
        (item) =>
          item.primary_owner === myUsername ||
          item.secondary_owner === myUsername
      )
    }

    // Filter: Only client responsibility
    if (smartFilters.clientResponsibility) {
      filtered = filtered.filter((item) => item.owner_type === 'Client')
    }

    // Filter: Only internal items
    if (smartFilters.internalOnly) {
      filtered = filtered.filter((item) => item.owner_type === 'Internal')
    }

    // Filter: Only overdue items
    if (smartFilters.overdueOnly) {
      filtered = filtered.filter((item) => item.is_overdue === true)
    }

    // Filter: Due this week
    if (smartFilters.dueThisWeek) {
      const today = new Date()
      const weekFromNow = new Date(today)
      weekFromNow.setDate(today.getDate() + 7)

      filtered = filtered.filter((item) => {
        const endDate =
          item.revised_planned_end || item.original_planned_end
        if (!endDate) return false

        const end = new Date(endDate)
        return end >= today && end <= weekFromNow
      })
    }

    return buildHierarchy(filtered)
  }

  const filteredWBSList = getFilteredWBSList()

  // Get count of related issues for a WBS ID
  const getRelatedIssuesCount = (wbsId) => {
    if (!issuesList || issuesList.length === 0) return 0

    return issuesList.filter((issue) => {
      if (!issue.affected_wbs) return false
      // affected_wbs is a comma-separated string
      const affectedWBSIds = issue.affected_wbs.split(',').map((id) => id.trim())
      return affectedWBSIds.includes(wbsId)
    }).length
  }

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <WBSForm
          initialData={editingItem}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          projectId={projectId}
          availableWBSList={wbsList}
        />
        {/* 新增成功後顯示回到列表按鈕 */}
        {continueAdding && !editingItem && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleCancel}
              className="btn-secondary"
            >
              ← 回到列表
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">WBS 項目管理</h1>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadTemplate}
              className="btn-secondary"
              disabled={excelLoading}
            >
              📥 下載範本
            </button>
            <button
              onClick={handleImportClick}
              className="btn-secondary"
              disabled={excelLoading || !projectId}
            >
              📤 匯入 Excel
            </button>
            <button
              onClick={handleExport}
              className="btn-secondary"
              disabled={excelLoading || !projectId}
            >
              📊 匯出 Excel
            </button>
            <button onClick={handleCreate} className="btn-primary">
              + 新增 WBS
            </button>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".xlsx,.xls"
          className="hidden"
        />

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <div>
            <label htmlFor="project-select" className="label">
              專案
            </label>
            <select
              id="project-select"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="input-field"
            >
              {projectsList.length === 0 ? (
                <option value="">請先建立專案</option>
              ) : (
                <>
                  <option value="">請選擇專案</option>
                  {projectsList.map((project) => (
                    <option key={project.project_id} value={project.project_id}>
                      {project.project_id} - {project.project_name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div>
            <label htmlFor="parent-wbs-filter" className="label">
              父 WBS ID
            </label>
            <select
              id="parent-wbs-filter"
              value={filters.parent_wbs_id}
              onChange={(e) => setFilters({ ...filters, parent_wbs_id: e.target.value })}
              className="input-field"
            >
              <option value="">全部</option>
              {(() => {
                // Only show top-level WBS items (those without parent_id)
                const topLevelItems = wbsList.filter(item => !item.parent_id)
                return topLevelItems.sort((a, b) => {
                  const aParts = a.wbs_id.split('.').map(Number)
                  const bParts = b.wbs_id.split('.').map(Number)
                  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
                    const aNum = aParts[i] || 0
                    const bNum = bParts[i] || 0
                    if (aNum !== bNum) return aNum - bNum
                  }
                  return 0
                }).map(item => (
                  <option key={item.item_id} value={item.wbs_id}>
                    {item.wbs_id} - {item.task_name}
                  </option>
                ))
              })()}
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

        {/* Smart Filters */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">智慧篩選</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* My Responsibility Filter */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={smartFilters.myResponsibility}
                  onChange={(e) =>
                    setSmartFilters({ ...smartFilters, myResponsibility: e.target.checked })
                  }
                  className="mr-2 rounded"
                />
                <span className="text-gray-700">只看我負責的</span>
              </label>
              {smartFilters.myResponsibility && (
                <input
                  type="text"
                  value={myUsername}
                  onChange={(e) => setMyUsername(e.target.value)}
                  placeholder="輸入您的姓名"
                  className="input-field text-sm ml-6"
                />
              )}
            </div>

            {/* Client Responsibility Filter */}
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={smartFilters.clientResponsibility}
                onChange={(e) =>
                  setSmartFilters({ ...smartFilters, clientResponsibility: e.target.checked })
                }
                className="mr-2 rounded"
              />
              <span className="text-gray-700">只看客戶責任</span>
            </label>

            {/* Internal Only Filter */}
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={smartFilters.internalOnly}
                onChange={(e) =>
                  setSmartFilters({ ...smartFilters, internalOnly: e.target.checked })
                }
                className="mr-2 rounded"
              />
              <span className="text-gray-700">只看內部項目</span>
            </label>

            {/* Overdue Only Filter */}
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={smartFilters.overdueOnly}
                onChange={(e) =>
                  setSmartFilters({ ...smartFilters, overdueOnly: e.target.checked })
                }
                className="mr-2 rounded"
              />
              <span className="text-gray-700 flex items-center">
                只看逾期項目
                <span className="ml-1 text-red-500">⚠️</span>
              </span>
            </label>

            {/* Due This Week Filter */}
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={smartFilters.dueThisWeek}
                onChange={(e) =>
                  setSmartFilters({ ...smartFilters, dueThisWeek: e.target.checked })
                }
                className="mr-2 rounded"
              />
              <span className="text-gray-700">只看本週到期</span>
            </label>

            {/* Clear All Filters Button */}
            {Object.values(smartFilters).some((v) => v) && (
              <button
                onClick={() =>
                  setSmartFilters({
                    myResponsibility: false,
                    clientResponsibility: false,
                    internalOnly: false,
                    overdueOnly: false,
                    dueThisWeek: false,
                  })
                }
                className="text-sm text-primary-600 hover:text-primary-800 underline"
              >
                清除所有篩選
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {(error || excelError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error || excelError}
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
          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    父 WBS ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    WBS ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    任務名稱
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    負責單位
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    預計開始
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    預計結束
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    調整後開始
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    調整後結束
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    進度
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
                {filteredWBSList.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="px-6 py-4 text-center text-gray-500">
                      {wbsList.length === 0 ? '暫無資料' : '無符合篩選條件的資料'}
                    </td>
                  </tr>
                ) : (
                  filteredWBSList.map((item) => (
                    <tr key={item.item_id} className={item.is_overdue ? 'bg-red-50' : ''}>
                      {/* 父 WBS ID 欄位 */}
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.parent_id ? (
                          <span className="text-gray-500">
                            {item.parent_id.includes('_') ? item.parent_id.split('_')[1] : item.parent_id}
                          </span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                      {/* WBS ID 欄位 */}
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center gap-1">
                          {/* Visual hierarchy indicator */}
                          {item.level > 0 && (
                            <span className="text-gray-400 text-xs">
                              {'  '.repeat(item.level)}└─
                            </span>
                          )}
                          <span className={item.level > 0 ? 'text-blue-600' : 'text-gray-900 font-bold'}>
                            {item.wbs_id}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <span className={item.level > 0 ? 'font-normal' : 'font-semibold'}>
                            {item.task_name}
                          </span>
                          {item.is_overdue && (
                            <span className="text-red-500">⚠️</span>
                          )}
                          {(() => {
                            const issueCount = getRelatedIssuesCount(item.wbs_id)
                            return issueCount > 0 ? (
                              <span
                                className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full font-semibold"
                                title={`${issueCount} 個相關問題`}
                              >
                                {issueCount} 問題
                              </span>
                            ) : null
                          })()}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.owner_unit || '-'}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.original_planned_start || '-'}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.original_planned_end || '-'}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.revised_planned_start ? (
                          <span className="text-blue-600">{item.revised_planned_start}</span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.revised_planned_end ? (
                          <span className="text-blue-600">{item.revised_planned_end}</span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${item.actual_progress}%` }}
                              ></div>
                            </div>
                            <span className="text-gray-900 font-semibold">{item.actual_progress}%</span>
                            {item.progress_variance !== undefined && item.progress_variance !== 0 && (
                              <span className={`ml-2 text-xs ${getProgressColor(item.progress_variance)}`}>
                                ({item.progress_variance > 0 ? '+' : ''}{item.progress_variance})
                              </span>
                            )}
                          </div>
                          {item.estimated_progress !== undefined && (
                            <div className="text-xs text-gray-500 mt-1">
                              預估: {item.estimated_progress}%
                            </div>
                          )}
                        </div>
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
            {filteredWBSList.length !== wbsList.length ? (
              <>
                顯示 {filteredWBSList.length} 筆（共 {total} 筆資料）
              </>
            ) : (
              <>共 {total} 筆資料</>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default WBSList
