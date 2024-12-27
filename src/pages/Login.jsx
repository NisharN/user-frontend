import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import black from '../assets/black.png'; // Ensure this path is correct.

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.email || !values.password) {
      toast.error('All fields are required.', { position: 'top-right' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/auth/login', values);
      if (response.status === 201) {
        localStorage.setItem('token', response.data.token);
        if (values.email === 'nisharadmin@gmail.com' && values.password === 'admin@03') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        toast.success('Login successful!', { position: 'top-right' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.', {
        position: 'top-right',
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 px-4 relative">
     
      <div className="absolute top-4 left-4">
        <img
          src={black}
          alt="Logo"
          className="inline-block h-[6rem] p-2 object-contain" 
        />
      </div>

      
      <div className="absolute top-4 right-4">
        <Link
          to="https://btfgroup.com/"
          className="text-black text-xl font-bold underline hover:text-green-500 transition-colors duration-300"
        >
          Visit Us
        </Link>
      </div>

     
      <div className="w-full md:w-3/4 h-[95%] flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
        
        <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-200">
          <img src={black} alt="Black Background" className="w-1/2 h-1/2 object-contain" />
        </div>

       
        <div className="w-full md:w-1/2 flex justify-center items-center bg-green-500 px-8 py-12 md:px-16 md:py-12">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-8 text-center text-black">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-black font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-black"
                  name="email"
                  onChange={handleChanges}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-black font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-black"
                  name="password"
                  onChange={handleChanges}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black hover:bg-green-800 text-white py-3 rounded-lg transition-transform transform hover:scale-105 hover:shadow-lg"
              >
                Submit
              </button>
            </form>

            <div className="text-center mt-6">
              <span className="text-black">Don't have an account?</span>{' '}
              <Link
                to="/register"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Signup
              </Link>
            </div>
          </div>
        </div>
      </div>

     
      <div className="absolute bottom-0 w-full bg-black text-white py-4 text-center">
        <span>&copy; Designed and Developed by Nishar Ahamed</span>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
