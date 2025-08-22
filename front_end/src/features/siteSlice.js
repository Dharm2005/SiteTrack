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
    }
  }
})

export const {setSites , addNewSite} = siteSlice.actions
export default siteSlice.reducer;