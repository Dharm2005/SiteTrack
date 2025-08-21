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
    addSite: (state , action) => {
      state.sites.push(action.payload)
    }
  }
})

export const {setSites , addSite} = siteSlice.actions
export default siteSlice.reducer;