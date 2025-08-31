import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  advances: [],
}

export const workerAdvanceSlice = createSlice({
  name: "advance",
  initialState,
  reducers: {
    setAdvances: (state , action) => {
      state.advances = action.payload;
    },
    addNewAdvance: (state , action) => {
      state.advances.push(action.payload)
    },
    clearAdvances: (state) => {
      state.advances = [];
    },
  }
})

export const {setAdvances , addNewAdvance , clearAdvances} = workerAdvanceSlice.actions;
export default workerAdvanceSlice.reducer;