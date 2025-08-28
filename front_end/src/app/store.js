import { configureStore } from "@reduxjs/toolkit";
import siteReducer from "../features/siteSlice";
import workerReducer from "../features/workerSlice";
import expenseReducer from "../features/expenseSlice";
import managerReducer from '../features/managerSlice'
import memoReducer from '../features/memoSliice'

export const store = configureStore({
  reducer : {
    site : siteReducer,
    worker : workerReducer,
    expense : expenseReducer,
    manager : managerReducer,
    memo : memoReducer
  }
})