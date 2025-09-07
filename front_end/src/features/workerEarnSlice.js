import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  earnings: [],
}

export const workerEarnSlice = createSlice({
  name: "earn",
  initialState,
  reducers: {
    setEarn: (state, action) => {
      state.earnings = action.payload;
    },
    addNewEarn: (state, action) => {
      state.earnings.push(action.payload)
    },
    updateEarn: (state, action) => {
      const updatedEarn = action.payload;
      state.earnings = state.earnings.map(earn =>
        earn._id === updatedEarn._id ? updatedEarn : earn
      )
    },
    clearEarn: (state) => {
      state.earnings = [];
    },
  }
})

export const { setEarn, addNewEarn, clearEarn, updateEarn } = workerEarnSlice.actions;
export default workerEarnSlice.reducer;