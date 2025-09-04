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
    updateWorker: (state , action) => {
      const updatedWorker = action.payload;
      state.workers = state.workers.map(worker => 
        worker._id === updatedWorker._id ? updatedWorker : worker
      )
    },
    deleteWorker: (state , action) => {
      state.workers = state.workers.filter(worker => worker._id !== action.payload)
    }
  }
})

export const {setWorkers , addNewWorker , deleteWorker , updateWorker} = workerSlice.actions
export default workerSlice.reducer;