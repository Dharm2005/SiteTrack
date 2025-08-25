import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  expenses : []
}

export const expenseSlice = createSlice({
  name : 'expense',
  initialState,
  reducers: {
    setExpenses: (state , action) => {
      state.expenses = action.payload;      
    },
    addNewExpense: (state , action) => {
      state.expenses.push(action.payload)
    }
  }
})

export const {setExpenses , addNewExpense} = expenseSlice.actions
export default expenseSlice.reducer;