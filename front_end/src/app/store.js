import { configureStore } from "@reduxjs/toolkit";
import siteReducer from "../features/siteSlice";
import workerReducer from "../features/workerSlice";
import materialReducer from "../features/materialSlice";

export const store = configureStore({
  reducer : {
    site : siteReducer,
    worker : workerReducer,
    material : materialReducer
  }
})