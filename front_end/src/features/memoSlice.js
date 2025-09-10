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
    },
    updateMemo: (state , action) => {
      const updatedMemo = action.payload;
      state.memos = state.memos.map(memo => 
        memo._id === updatedMemo._id ? updatedMemo : memo
      )
    },
    deleteMemo : (state , action) => {
      state.memos = state.memos.filter(memo => memo._id !== action.payload)
    }
  }
})

export const {setMemos , addNewMemo , deleteMemo , updateMemo} = memoSlice.actions
export default memoSlice.reducer;