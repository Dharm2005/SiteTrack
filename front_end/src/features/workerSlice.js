import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  workers : []
}

export const workerSlice = createSlice({
  name : 'worker',
  initialState,
  reducers: {
    setWorkers: (state , action) => {
      state.workers = action.payload;      
    },
    addNewWorker: (state , action) => {
      state.workers.push(action.payload)
    },
    deleteWorker: (state , action) => {
      state.workers = state.workers.filter(worker => worker._id !== action.payload)
    }
  }
})

export const {setWorkers , addNewWorker , deleteWorker} = workerSlice.actions
export default workerSlice.reducer;