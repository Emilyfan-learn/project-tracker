/**
 * WBS Form Component for creating and editing WBS items
 */
import React, { useState, useEffect } from 'react'
import api from '../utils/api'

const WBSForm = ({ initialData = null, onSubmit, onCancel, projectId }) => {
  const [availableParents, setAvailableParents] = useState([])
  const [formData, setFormData] = useState({
    project_id: projectId || '',
    wbs_id: '',
    parent_id: '',
    task_name: '',
    category: 'Task',
    owner_unit: '',
    original_planned_start: '',
    original_planned_end: '',
    revised_planned_start: '',
    revised_planned_end: '',
    actual_start_date: '',
    actual_end_date: '',
    work_days: '',
    actual_progress: 0,
    status: '未開始',
    notes: '',
  })

  const [errors, setErrors] = useState({})

  // Calculate work days between two dates
  const calculateWorkDays = (startDate, endDate) => {
    if (!startDate || !endDate) return null
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null

    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays + 1 // Include both start and end dates
  }

  // Calculate work days for each phase
  const originalPlanDays = calculateWorkDays(
    formData.original_planned_start,
    formData.original_planned_end
  )
  const revisedPlanDays = calculateWorkDays(
    formData.revised_planned_start,
    formData.revised_planned_end
  )
  const actualDays = calculateWorkDays(
    formData.actual_start_date,
    formData.actual_end_date
  )

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Convert date objects to string format for input fields
        original_planned_start: initialData.original_planned_start || '',
        original_planned_end: initialData.original_planned_end || '',
        revised_planned_start: initialData.revised_planned_start || '',
        revised_planned_end: initialData.revised_planned_end || '',
        actual_start_date: initialData.actual_start_date || '',
        actual_end_date: initialData.actual_end_date || '',
      })
    }
  }, [initialData])

  // Fetch available parent WBS items
  useEffect(() => {
    if (projectId) {
      fetchAvailableParents()
    }
  }, [projectId])

  const fetchAvailableParents = async () => {
    try {
      const response = await api.get('/wbs/', {
        params: { project_id: projectId, limit: 1000 }
      })
      // Filter out current item to prevent self-reference
      const items = response.items || []
      const filteredItems = initialData
        ? items.filter(item => item.item_id !== initialData.item_id)
        : items
      setAvailableParents(filteredItems)
    } catch (err) {
      console.error('Failed to fetch parent items:', err)
      setAvailableParents([])
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.project_id) {
      newErrors.project_id = '請輸入專案 ID'
    }

    if (!formData.wbs_id) {
      newErrors.wbs_id = '請輸入 WBS 編號'
    }

    if (!formData.task_name) {
      newErrors.task_name = '請輸入任務名稱'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    // Prepare data for submission
    const submitData = {
      ...formData,
      work_days: formData.work_days ? parseInt(formData.work_days) : null,
      actual_progress: parseInt(formData.actual_progress) || 0,
    }

    // Remove empty strings and convert to null
    Object.keys(submitData).forEach((key) => {
      if (submitData[key] === '') {
        submitData[key] = null
      }
    })

    onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900">
        {initialData ? '編輯 WBS 項目' : '新增 WBS 項目'}
      </h2>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Project ID */}
        <div>
          <label htmlFor="project_id" className="label">
            專案 ID *
          </label>
          <input
            type="text"
            id="project_id"
            name="project_id"
            value={formData.project_id}
            onChange={handleChange}
            disabled={!!initialData}
            className="input-field"
          />
          {errors.project_id && (
            <p className="text-red-500 text-sm mt-1">{errors.project_id}</p>
          )}
        </div>

        {/* WBS ID */}
        <div>
          <label htmlFor="wbs_id" className="label">
            WBS 編號 *
          </label>
          <input
            type="text"
            id="wbs_id"
            name="wbs_id"
            value={formData.wbs_id}
            onChange={handleChange}
            disabled={!!initialData}
            placeholder="例如: 1, 2.1, 2.1.3"
            className="input-field"
          />
          {errors.wbs_id && (
            <p className="text-red-500 text-sm mt-1">{errors.wbs_id}</p>
          )}
        </div>

        {/* Parent WBS ID - Dropdown Selection */}
        <div>
          <label htmlFor="parent_id" className="label">
            父項目 (選填)
          </label>
          <select
            id="parent_id"
            name="parent_id"
            value={formData.parent_id}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">-- 無 (頂層項目) --</option>
            {availableParents.map((item) => (
              <option key={item.item_id} value={item.wbs_id}>
                {item.wbs_id} - {item.task_name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            選擇父項目以建立階層關係，留空表示頂層項目
          </p>
        </div>

        {/* Task Name */}
        <div className="md:col-span-2">
          <label htmlFor="task_name" className="label">
            任務名稱 *
          </label>
          <input
            type="text"
            id="task_name"
            name="task_name"
            value={formData.task_name}
            onChange={handleChange}
            className="input-field"
          />
          {errors.task_name && (
            <p className="text-red-500 text-sm mt-1">{errors.task_name}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="label">
            類別
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-field"
          >
            <option value="Task">Task</option>
            <option value="Milestone">Milestone</option>
          </select>
        </div>

        {/* Owner Unit */}
        <div>
          <label htmlFor="owner_unit" className="label">
            負責單位
          </label>
          <input
            type="text"
            id="owner_unit"
            name="owner_unit"
            value={formData.owner_unit}
            onChange={handleChange}
            placeholder="例如: 開發部, AAA/BBB, 客戶"
            className="input-field"
          />
        </div>
      </div>

      {/* Schedule - Phase 1: Original Plan */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-700">
            階段 1: 原始計畫
          </h3>
          {originalPlanDays !== null && (
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              工作天數: {originalPlanDays} 天
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="original_planned_start" className="label">
              預計開始日期
            </label>
            <input
              type="date"
              id="original_planned_start"
              name="original_planned_start"
              value={formData.original_planned_start}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="original_planned_end" className="label">
              預計結束日期
            </label>
            <input
              type="date"
              id="original_planned_end"
              name="original_planned_end"
              value={formData.original_planned_end}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Schedule - Phase 2: Revised Plan */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-700">
            階段 2: 調整計畫
          </h3>
          {revisedPlanDays !== null && (
            <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              工作天數: {revisedPlanDays} 天
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="revised_planned_start" className="label">
              調整後開始日期
            </label>
            <input
              type="date"
              id="revised_planned_start"
              name="revised_planned_start"
              value={formData.revised_planned_start}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="revised_planned_end" className="label">
              調整後結束日期
            </label>
            <input
              type="date"
              id="revised_planned_end"
              name="revised_planned_end"
              value={formData.revised_planned_end}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Schedule - Phase 3: Actual */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-700">
            階段 3: 實際執行
          </h3>
          {actualDays !== null && (
            <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
              工作天數: {actualDays} 天
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="actual_start_date" className="label">
              實際開始日期
            </label>
            <input
              type="date"
              id="actual_start_date"
              name="actual_start_date"
              value={formData.actual_start_date}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="actual_end_date" className="label">
              實際結束日期
            </label>
            <input
              type="date"
              id="actual_end_date"
              name="actual_end_date"
              value={formData.actual_end_date}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="work_days" className="label">
              工作天數 (可手動輸入)
            </label>
            <input
              type="number"
              id="work_days"
              name="work_days"
              value={formData.work_days}
              onChange={handleChange}
              min="0"
              placeholder={actualDays ? actualDays.toString() : ''}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Progress and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="actual_progress" className="label">
            實際完成進度 (%)
          </label>
          <input
            type="number"
            id="actual_progress"
            name="actual_progress"
            value={formData.actual_progress}
            onChange={handleChange}
            min="0"
            max="100"
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="status" className="label">
            狀態
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input-field"
          >
            <option value="未開始">未開始</option>
            <option value="進行中">進行中</option>
            <option value="已完成">已完成</option>
          </select>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="label">
          備註
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          className="input-field"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          取消
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          {initialData ? '更新' : '新增'}
        </button>
      </div>
    </form>
  )
}

export default WBSForm
