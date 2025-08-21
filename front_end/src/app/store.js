import { configureStore } from "@reduxjs/toolkit";
import siteReducer from "../features/siteSlice";

export const store = configureStore({
  reducer : {
    site : siteReducer
  }
})