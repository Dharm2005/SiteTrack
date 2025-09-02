import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  sites : []
}

export const siteSlice = createSlice({
  name : 'site',
  initialState,
  reducers: {
    setSites: (state , action) => {
      state.sites = action.payload;      
    },
    addNewSite: (state , action) => {
      state.sites.push(action.payload)
    },
    deleteSite: (state, action) => {
      state.sites = state.sites.filter((site) => site._id !== action.payload);
    }
  }
})

export const {setSites , addNewSite , deleteSite} = siteSlice.actions
export default siteSlice.reducer;