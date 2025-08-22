import { configureStore } from "@reduxjs/toolkit";
import siteReducer from "../features/siteSlice";
import workerReducer from "../features/workerSlice";

export const store = configureStore({
  reducer : {
    site : siteReducer,
    worker : workerReducer
  }
})