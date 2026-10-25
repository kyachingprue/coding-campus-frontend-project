import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { PracticeProgress } from '../../lib/types'

function readPracticeProgress(): Record<string, PracticeProgress> {
  try {
    const stored = localStorage.getItem('codeforge_practice_progress')
    return stored ? JSON.parse(stored) as Record<string, PracticeProgress> : {}
  } catch {
    return {}
  }
}

const initialState = {
  enrolledIds: [] as string[],
  practiceProgress: readPracticeProgress()
}

const coursesSlice = createSlice({
  name: 'courses',
  initialState,

  reducers: {
    setEnrolledIds(state, action: PayloadAction<string[]>) {
      state.enrolledIds = action.payload
    },
    saveQuizAttempt(state, action: PayloadAction<{ courseId: string; score: number; total: number }>) {
      const { courseId, score, total } = action.payload
      const previous = state.practiceProgress[courseId] ?? {}
      const attempts = (previous.attempts ?? 0) + 1

      state.practiceProgress[courseId] = {
        ...previous,
        attempts,
        lastScore: score,
        lastTotal: total,
        bestScore: Math.max(previous.bestScore ?? 0, score),
        bestTotal: total,
        lastAttemptAt: new Date().toISOString()
      }
      localStorage.setItem(
        'codeforge_practice_progress',
        JSON.stringify(state.practiceProgress)
      )
    },
    togglePracticeTask(state, action: PayloadAction<{ courseId: string; taskId: string }>) {
      const { courseId, taskId } = action.payload
      const previous = state.practiceProgress[courseId] ?? {}
      const completedTasks = previous.completedTasks ?? []

      state.practiceProgress[courseId] = {
        ...previous,
        completedTasks: completedTasks.includes(taskId)
          ? completedTasks.filter((id) => id !== taskId)
          : [...completedTasks, taskId]
      }
      localStorage.setItem(
        'codeforge_practice_progress',
        JSON.stringify(state.practiceProgress)
      )
    }
  }
})

export const { setEnrolledIds, saveQuizAttempt, togglePracticeTask } = coursesSlice.actions

export default coursesSlice.reducer
