import { createSlice } from '@reduxjs/toolkit'

function readEnrolled() {
  try {
    const stored = localStorage.getItem('codeforge_enrolled')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const initialState = {
  enrolledIds: readEnrolled()
}

const coursesSlice = createSlice({
  name: 'courses',
  initialState,

  reducers: {
    toggleEnroll(state, action) {
      const id = action.payload

      if (state.enrolledIds.includes(id)) {
        state.enrolledIds = state.enrolledIds.filter(
          courseId => courseId !== id
        )
      } else {
        state.enrolledIds.push(id)
      }

      localStorage.setItem(
        'codeforge_enrolled',
        JSON.stringify(state.enrolledIds)
      )
    }
  }
})

export const { toggleEnroll } = coursesSlice.actions

export default coursesSlice.reducer
