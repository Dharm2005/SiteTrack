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
    },
    updateManager: (state , action) => {
      const updatedManager = action.payload

      state.managers = state.managers.map(manager =>
        manager._id === updatedManager._id ? updatedManager : manager
      )
    },
    deleteManager: (state , action) => {
      state.managers = state.managers.filter(manager => manager._id !== action.payload);
    }
  }
})

export const {setManagers , addNewManager , updateManager ,deleteManager} = managerSlice.actions
export default managerSlice.reducer;