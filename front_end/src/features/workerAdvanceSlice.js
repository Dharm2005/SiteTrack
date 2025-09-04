import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  advances: [],
}

export const workerAdvanceSlice = createSlice({
  name: "advance",
  initialState,
  reducers: {
    setAdvances: (state, action) => {
      state.advances = action.payload;
    },
    addNewAdvance: (state, action) => {
      state.advances.push(action.payload)
    },
    updateAdvance: (state, action) => {
      const updatedAdvance = action.payload;
      state.advances = state.advances.map(advance =>
        advance._id === updatedAdvance._id ? updatedAdvance : advance
      )
    },
    clearAdvances: (state) => {
      state.advances = [];
    },
  }
})

export const { setAdvances, addNewAdvance, clearAdvances, updateAdvance } = workerAdvanceSlice.actions;
export default workerAdvanceSlice.reducer;