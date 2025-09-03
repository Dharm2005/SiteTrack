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
    },
    deleteExpense: (state , action) => {
      state.expenses = state.expenses.filter(expense => expense._id !== action.payload)
    },
  }
})

export const {setExpenses , addNewExpense , deleteExpense} = expenseSlice.actions
export default expenseSlice.reducer;