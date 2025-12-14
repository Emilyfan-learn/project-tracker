/**
 * Gantt Chart Component using Frappe Gantt
 */
import React, { useEffect, useRef } from 'react'
import Gantt from 'frappe-gantt'
import 'frappe-gantt/dist/frappe-gantt.css'

const GanttChart = ({ tasks, viewMode = 'Day', onTaskClick, onDateChange }) => {
  const ganttRef = useRef(null)
  const ganttInstance = useRef(null)

  useEffect(() => {
    if (!ganttRef.current || !tasks || tasks.length === 0) return

    // Convert WBS data to Gantt format
    const ganttTasks = tasks.map((task) => ({
      id: task.wbs_id,
      name: task.task_name || task.wbs_id,
      start: task.revised_planned_start || task.original_planned_start || new Date().toISOString().split('T')[0],
      end: task.revised_planned_end || task.original_planned_end || new Date().toISOString().split('T')[0],
      progress: task.actual_progress || 0,
      dependencies: task.dependencies || '',
      custom_class: getTaskClass(task),
    }))

    // Destroy existing instance
    if (ganttInstance.current) {
      ganttInstance.current = null
      ganttRef.current.innerHTML = ''
    }

    // Create new Gantt instance
    try {
      ganttInstance.current = new Gantt(ganttRef.current, ganttTasks, {
        view_mode: viewMode,
        bar_height: 30,
        bar_corner_radius: 3,
        arrow_curve: 5,
        padding: 18,
        date_format: 'YYYY-MM-DD',
        language: 'zh-TW',
        custom_popup_html: (task) => {
          const originalTask = tasks.find(t => t.wbs_id === task.id)
          return `
            <div class="gantt-popup">
              <h3 style="margin: 0 0 10px 0; font-size: 14px;">${task.name}</h3>
              <p style="margin: 5px 0; font-size: 12px;"><strong>WBS ID:</strong> ${task.id}</p>
              <p style="margin: 5px 0; font-size: 12px;"><strong>開始:</strong> ${task._start.toLocaleDateString('zh-TW')}</p>
              <p style="margin: 5px 0; font-size: 12px;"><strong>結束:</strong> ${task._end.toLocaleDateString('zh-TW')}</p>
              <p style="margin: 5px 0; font-size: 12px;"><strong>進度:</strong> ${task.progress}%</p>
              ${originalTask?.responsible_person ? `<p style="margin: 5px 0; font-size: 12px;"><strong>負責人:</strong> ${originalTask.responsible_person}</p>` : ''}
              ${originalTask?.status ? `<p style="margin: 5px 0; font-size: 12px;"><strong>狀態:</strong> ${originalTask.status}</p>` : ''}
            </div>
          `
        },
        on_click: (task) => {
          if (onTaskClick) {
            const originalTask = tasks.find(t => t.wbs_id === task.id)
            onTaskClick(originalTask)
          }
        },
        on_date_change: (task, start, end) => {
          if (onDateChange) {
            onDateChange(task.id, start, end)
          }
        },
      })
    } catch (error) {
      console.error('Error creating Gantt chart:', error)
    }

    return () => {
      if (ganttInstance.current) {
        ganttInstance.current = null
      }
    }
  }, [tasks, viewMode, onTaskClick, onDateChange])

  const getTaskClass = (task) => {
    // Add custom classes based on task status
    if (task.status === '已完成') return 'gantt-bar-complete'
    if (task.status === '進行中') return 'gantt-bar-in-progress'
    if (task.status === '延遲') return 'gantt-bar-delayed'
    if (task.variance_progress && task.variance_progress < -10) return 'gantt-bar-behind'
    return ''
  }

  return (
    <div className="gantt-container">
      <svg ref={ganttRef}></svg>
    </div>
  )
}

export default GanttChart
