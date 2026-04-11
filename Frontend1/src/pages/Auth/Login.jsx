import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  // Handle Login Form Submit
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }


    setError("");

    // Login API Call
     try {
       const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
       });
       const { token, user } = response.data;

       if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
       }
     } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again");
      }
     }
  } 

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center z-10 relative">
        <h3 className="text-xl font-semibold text-black dark:text-white transition-colors">Welcome Back</h3>
        <p className="text-xs text-slate-700 dark:text-slate-400 mt-[5px] mb-6 transition-colors">
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Password must be at least 8 characters long"
            type="password"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary w-full py-3 rounded-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.01] transition-transform">
            LOGIN
          </button>

          <p className="text-[13px] text-slate-800 dark:text-slate-300 mt-5 text-center md:text-left transition-colors">
            Don't have an account?{" "}
            <Link className="font-medium text-primary dark:text-violet-400 underline decoration-2 underline-offset-4" to="/signup">
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
