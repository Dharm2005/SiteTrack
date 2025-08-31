import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  memos : []
}

export const memoSlice = createSlice({
  name : 'memo',
  initialState,
  reducers : {
    setMemos : (state , action) => {
      state.memos = action.payload
    },
    addNewMemo : (state , action) => {
      state.memos.push(action.payload)
    }
  }
})

export const {setMemos , addNewMemo} = memoSlice.actions
export default memoSlice.reducer;