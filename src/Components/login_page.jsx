// Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/auth_context";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

   const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/"); // Redirect to dashboard
    } catch (err) {
      setError("Invalid credentials or failed to authenticate.");
    }
  };


  return (
    <div className="bg-white w-full h-screen">
    <div className="bg-orange-950 text-center mx-auto mt-20 rounded-2xl shadow-md p-10 w-full max-w-md h-[70%]">
      <h2 className="text-3xl font-semibold tracking-[.2em] text-amber-50 text-center mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4 text-left">
        <label  className="tracking-[.2em]  text-amber-50 text-left mb-2 ">Email</label>
        <input
          type="email"
          placeholder="Email"
          className="w-full bg-white px-3 py-2 mt-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
                <label className="tracking-[.2em]  text-amber-50 text-left mb-5 ">Password</label>

        <input
          type="password"
          placeholder="Password"
          className="w-full bg-white px-3 py-2 mt-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="text-center">
        <button type="submit" className="w-[30%] mt-10 mx-auto text-center bg-amber-50 text-orange-950 font-semibold tracking-[.1em] cursor-pointer hover:bg-orange-950 hover:text-amber-50 py-2 rounded">
          Login
        </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default LoginPage;
