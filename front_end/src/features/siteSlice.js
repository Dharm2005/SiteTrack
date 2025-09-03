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
    updateSite: (state , action) => {
      const updatedSite = action.payload;

      state.sites = state.sites.map(site => 
        site._id === updatedSite._id ? updatedSite : site)
    },
    deleteSite: (state, action) => {
      state.sites = state.sites.filter((site) => site._id !== action.payload);
    }
  }
})

export const {setSites , addNewSite , deleteSite , updateSite} = siteSlice.actions
export default siteSlice.reducer;