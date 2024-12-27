import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaRegUser, FaUser, FaEnvelope, FaCalendarAlt, FaVenusMars, FaPhone, FaCity, FaCheckCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Footer = () => (
  <footer className="bg-gray-800 text-white p-4 text-center">
    <p>&copy; Nishar Ahamed N. Task Done For Black Tulip Flowers LLC.</p>
  </footer>
);

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); 
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({}); 
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const updatePassword = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:4000/auth/change-password',
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        toast.success('Password changed successfully');
        setShowChangePassword(false);
        setPasswordData({ currentPassword: '', newPassword: '' });
        localStorage.removeItem('token');
        navigate('/login'); 
      }
    } catch (err) {
      console.error(err);
      toast.error('Error changing password');
    }
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/auth/home', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setUser(response.data.user);
        setFormData(response.data.user);
      } else {
        navigate('/login');
      }
    } catch (err) {
      navigate('/login');
      console.log(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:4000/auth/home',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setUser(formData);
        setEditing(false);
        toast.success('Details updated successfully');
      }
    } catch (err) {
      console.log(err);
      toast.error('Error updating details');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    toast.info('Logged out successfully');
    navigate('/login'); 
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const currentDate = new Date();
  const dayOfWeek = currentDate.toLocaleString('default', { weekday: 'long' });
  const date = currentDate.toLocaleDateString();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
       
        <div className="w-64 bg-gray-800 text-white min-h-screen flex flex-col">
          <div className="flex items-center justify-between p-4">
           
            <div className="flex items-center">
              <FaRegUser className="text-3xl" />
            </div>
            <div className="text-center">
              <p className="text-sm">{user.username}</p>
              <p className="text-xs">{user.email}</p>
            </div>
          </div>

          <div className="mt-10">
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => setEditing(true)}
                  className="w-full text-left px-4 py-2 hover:bg-blue-500 transition-all duration-300"
                >
                  Edit User Details
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="w-full text-left px-4 py-2 hover:bg-blue-500 transition-all duration-300"
                >
                  Change Password
                </button>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-red-500 transition-all duration-300"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>

        
        <div className="flex-1 p-8">
          <div className="bg-white p-5 rounded shadow-md">
            <div className="flex justify-between items-center mb-5">
              <h1 className="text-xl font-semibold">Hey, {user.username}</h1>
              <p className="text-gray-500 text-sm">{dayOfWeek}, {date}</p>
            </div>

            {!editing ? (
              <div className="space-y-4">
                <p>
                  <FaUser className="inline text-blue-500 mr-2" />
                  <strong>Username:</strong> {user.username}
                </p>
                <p>
                  <FaEnvelope className="inline text-green-500 mr-2" />
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <FaCalendarAlt className="inline text-orange-500 mr-2" />
                  <strong>Date of Birth:</strong> {user.dob}
                </p>
                <p>
                  <FaVenusMars className="inline text-purple-500 mr-2" />
                  <strong>Gender:</strong> {user.gender}
                </p>
                <p>
                  <FaPhone className="inline text-gray-500 mr-2" />
                  <strong>Phone:</strong> {user.phone}
                </p>
                <p>
                  <FaCity className="inline text-yellow-500 mr-2" />
                  <strong>City:</strong> {user.city}
                </p>
                <p>
                  <FaCheckCircle
                    className={`inline mr-2 ${
                      user.isVerified ? 'text-green-500' : 'text-red-500'
                    }`}
                  />
                  <strong>Status:</strong>{' '}
                  {user.isVerified ? (
                    <span className="text-green-500 font-bold">Verified</span>
                  ) : (
                    <span className="text-red-500 font-bold">Not Verified</span>
                  )}
                </p>
               
                {showChangePassword && (
                  <div className="mt-5 space-y-4">
                    <label>
                      Current Password:
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="block w-full border p-2 rounded"
                      />
                    </label>
                    <label>
                      New Password:
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="block w-full border p-2 rounded"
                      />
                    </label>
                    <button
                      onClick={updatePassword}
                      className="mt-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition-all duration-300"
                    >
                      Change Password
                    </button>
                    <button
                      onClick={() => setShowChangePassword(false)}
                      className="mt-3 ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <label>
                  Username:
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="block w-full border p-2 rounded"
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full border p-2 rounded"
                  />
                </label>
                <label>
                  Date of Birth:
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="block w-full border p-2 rounded"
                  />
                </label>
                <label>
                  Gender:
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="block w-full border p-2 rounded"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label>
                  Phone:
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block w-full border p-2 rounded"
                  />
                </label>
                <label>
                  City:
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="block w-full border p-2 rounded"
                  />
                </label>
                <button
                  onClick={handleUpdate}
                  className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all duration-300"
                >
                  Update Details
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="mt-3 ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer/>
    </div>
  );
};

export default Home;
