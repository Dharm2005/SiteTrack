import { configureStore } from "@reduxjs/toolkit";
import siteReducer from "../features/siteSlice";
import workerReducer from "../features/workerSlice";
import expenseReducer from "../features/expenseSlice";
import managerReducer from '../features/managerSlice'
import memoReducer from '../features/memoSlice'
import workerAdvanceReducer from '../features/workerAdvanceSlice'
import workerEarnReducer from '../features/workerEarnSlice'
import authReducer from '../features/authSlice'

export const store = configureStore({
  reducer : {
    auth : authReducer,
    site : siteReducer,
    worker : workerReducer,
    expense : expenseReducer,
    manager : managerReducer,
    memo : memoReducer,
    advance : workerAdvanceReducer,
    earn : workerEarnReducer,
  }
})