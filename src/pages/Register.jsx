import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import black from "../assets/black.png"; 

const Register = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    phone: "",
    city: "",
  });

  const navigate = useNavigate();

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateForm = () => {
    let formErrors = [];

    if (!values.email.endsWith("@gmail.com")) {
      formErrors.push("Email must end with @gmail.com.");
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/;
    if (!passwordRegex.test(values.password)) {
      formErrors.push(
        "Password must be at least 6 characters with letters, numbers, and special characters."
      );
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(values.phone)) {
      formErrors.push("Phone number must be exactly 10 digits.");
    }

    if (!values.dob) {
      formErrors.push("Date of birth is required.");
    } else if (calculateAge(values.dob) < 18) {
      formErrors.push("Age must be greater than 18.");
    }

    if (!values.gender) {
      formErrors.push("Gender is required.");
    }

    if (!values.city) {
      formErrors.push("City is required.");
    }

    if (formErrors.length > 0) {
      toast.error(formErrors.join(" "), { position: "top-right" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:4000/auth/register", values);

      if (response.status === 200 || response.status === 201) {
        navigate("/login");
        toast.success("Registration successful!", { position: "top-right" });
        setValues({
          username: "",
          email: "",
          password: "",
          dob: "",
          gender: "",
          phone: "",
          city: "",
        });
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Registration failed.", {
          position: "top-right",
        });
      } else {
        toast.error("Something went wrong. Please try again.", { position: "top-right" });
      }
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen bg-white text-black px-4">
     
      <div className="flex justify-between items-center mb-6 p-2">
        <img src={black} alt="Logo" className="h-[4rem] sm:h-[5rem]" />
        <Link to="https://btfgroup.com" className="text-xl font-semibold text-black hover:underline hover:text-green-500">
          Visit Us
        </Link>
      </div>

      <div className="flex justify-center items-center flex-grow">
        <div className="shadow-lg px-8 py-5 border bg-white max-w-2xl w-full rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center font-sans text-gray-800">Register</h2>

          <form onSubmit={handleSubmit} className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="username" className="block text-gray-700 font-medium">
                User Name
              </label>
              <input
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                type="text"
                name="username"
                onChange={handleChanges}
                value={values.username}
                placeholder="Enter Username"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium">
                Email
              </label>
              <input
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                type="email"
                name="email"
                onChange={handleChanges}
                value={values.email}
                placeholder="Enter Email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium">
                Password
              </label>
              <input
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                type="password"
                name="password"
                onChange={handleChanges}
                value={values.password}
                placeholder="Enter Password"
                required
              />
            </div>

            <div>
              <label htmlFor="dob" className="block text-gray-700 font-medium">
                Date of Birth
              </label>
              <input
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                type="date"
                name="dob"
                onChange={handleChanges}
                value={values.dob}
                required
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-gray-700 font-medium">
                Gender
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                name="gender"
                onChange={handleChanges}
                value={values.gender}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="phone" className="block text-gray-700 font-medium">
                Phone Number
              </label>
              <input
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                type="text"
                name="phone"
                onChange={handleChanges}
                value={values.phone}
                placeholder="Enter Phone Number"
                required
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-gray-700 font-medium">
                City
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                name="city"
                onChange={handleChanges}
                value={values.city}
                required
              >
                <option value="">Select City</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>

            <div className="col-span-2">
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-transform transform hover:scale-105"
              >
                Submit
              </button>
            </div>
          </form>

          <div className="text-center my-4">
            <p className="mb-2">Already have an account?</p>
            <Link to="/login" className="bg-blue-500 text-white p-2 border rounded-md  hover:black">
              Login
            </Link>
          </div>
        </div>
      </div>

     
      <footer className="text-center w-full py-2 mt-6 text-black bg-green-500">
        <p>Designed and Developed by Nishar Ahamed &copy; 2024</p>
      </footer>

      <ToastContainer />
    </div>
  );
};

export default Register;
