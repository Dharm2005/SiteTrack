import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Home, AddSite, NotFound, SiteDetail, AddManager, AllManager, Expenses, Workers, EditSite, EditManager, EditWorker, EditExpense, Login, Signup, RecycleData, ChangePass, } from "./components"
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { store } from './app/store.js'
import { Provider } from 'react-redux'
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx'
import PublicRoute from './components/Auth/PublicRouter.jsx'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>

      <Route path='login' element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path='signup' element={
        <PublicRoute>
          <Signup />
        </PublicRoute>
      } />

      <Route path='auth/change-password' element={
        <ProtectedRoute roles={['admin', 'manager']}>
          < ChangePass />
        </ProtectedRoute>
      } />

      <Route path='' element={
        <ProtectedRoute roles={['admin', 'manager']}>
          <Home />
        </ProtectedRoute>
      } />

      <Route path='add-site' element={
        <ProtectedRoute roles={['admin']}>
          <AddSite />
        </ProtectedRoute>
      } />

      <Route path='edit-site/:id' element={
        <ProtectedRoute roles={['admin']}>
          <EditSite />
        </ProtectedRoute>
      } />

      <Route path='edit-manager/:id' element={
        <ProtectedRoute roles={['admin']}>
          <EditManager />
        </ProtectedRoute>
      } />

      <Route path='edit-worker/:id' element={
        <ProtectedRoute roles={['manager']}>
          <EditWorker />
        </ProtectedRoute>
      } />

      <Route path='edit-expense/:id' element={
        <ProtectedRoute roles={['manager']}>
          <EditExpense />
        </ProtectedRoute>
      } />

      <Route path='add-manager' element={
        <ProtectedRoute roles={['admin']}>
          <AddManager />
        </ProtectedRoute>
      } />

      <Route path='all-manager' element={
        <ProtectedRoute roles={['admin']}>
          <AllManager />
        </ProtectedRoute>
      } />

      <Route path='site/:id' element={
        <ProtectedRoute roles={['admin', 'manager']}>
          <SiteDetail />
        </ProtectedRoute>
      } />

      <Route path='site/:id/expenses' element={
        <ProtectedRoute roles={['admin', 'manager']}>
          < Expenses />
        </ProtectedRoute>
      } />

      <Route path='site/:id/workers' element={
        <ProtectedRoute roles={['admin', 'manager']}>
          < Workers />
        </ProtectedRoute>
      } />

      <Route path='recycle-bin' element={
        <ProtectedRoute roles={['admin']}>
          < RecycleData />
        </ProtectedRoute>
      } />

      <Route path='site/:id/recycle-bin' element={
        <ProtectedRoute roles={['manager']}>
          < RecycleData />
        </ProtectedRoute>
      } />

      <Route path='*' element={<NotFound />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </Provider>
  </StrictMode>,
)
