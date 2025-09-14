import React, { useState } from 'react'
import { login } from '../../services/authService'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { setAuth } from '../../features/authSlice';
import { toast } from 'react-toastify';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    password: '',
    role: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login(form)

      console.log(res);
      
      if (res.success === false) {
        if (res.errors && res.errors.length > 0) {
          console.log("Validation/Server error:", res);
          res.errors.forEach(err => toast.error(err))
        } else if(res.message){
          toast.error(res.message);
        } else {
          toast.error("Something went wrong");
        }
        return;
      }
      if (res.token) {
        localStorage.setItem("token", res.token); // save JWT
        dispatch(setAuth(res))
        toast.success("Login Successfully");
        navigate("/"); // redirect after login
      }
    } catch (error) {
      console.error("Error while login", error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter your credentials to continue
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                name="username"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-200"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                name="password"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-200"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Role
              </label>
              <div className="flex space-x-6">
                <div className="flex items-center">
                  <input
                    id="admin"
                    type="radio"
                    name="role"
                    value="admin"
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="admin" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                    Admin
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="manager"
                    type="radio"
                    name="role"
                    value="manager"
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="manager" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                    Manager
                  </label>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 transform hover:scale-105"
              >
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login