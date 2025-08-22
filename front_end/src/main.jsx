import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Home , AddSite , NotFound} from "./components"
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { store } from './app/store.js'
import {Provider} from 'react-redux'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path = '/' element = {<App />}>
      <Route path = '' element = {<Home />} />
      <Route path = '/add-site' element = {<AddSite />} />
      <Route path = '/*' element = {<NotFound />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store = {store}>
      <RouterProvider router={router}  />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </Provider>
  </StrictMode>,
)
