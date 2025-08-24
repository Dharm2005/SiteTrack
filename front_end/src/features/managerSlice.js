import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  managers : []
}

export const managerSlice = createSlice({
  name : 'manager',
  initialState,
  reducers: {
    setManagers: (state , action) => {
      state.managers = action.payload;      
    },
    addNewManager: (state , action) => {
      state.managers.push(action.payload)
    }
  }
})

export const {setManagers , addNewManager} = managerSlice.actions
export default managerSlice.reducer;