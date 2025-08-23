import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  materials : []
}

export const materialSlice = createSlice({
  name : 'material',
  initialState,
  reducers: {
    setMaterials: (state , action) => {
      state.materials = action.payload;      
    },
    addNewMaterial: (state , action) => {
      state.materials.push(action.payload)
    }
  }
})

export const {setMaterials , addNewMaterial} = materialSlice.actions
export default materialSlice.reducer;