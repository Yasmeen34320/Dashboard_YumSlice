// Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/auth_context";
import img1 from '../assets/10.jpeg' // 1 , 3 , 8 , 10 ,11
import { auth, googleProvider } from '../services/firebase';
import {
  signInWithPopup,
} from 'firebase/auth';
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

const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // 🚫 Block new signups with Google — allow only pre-existing users
    const metadata = user.metadata;
    const creationTime = new Date(metadata.creationTime).getTime();
    const lastSignInTime = new Date(metadata.lastSignInTime).getTime();

    // Check if this is a new user (signed in for the first time)
    if (Math.abs(creationTime - lastSignInTime) < 5000) {
      // User just got created → Not allowed
      await user.delete();

      await auth.signOut();

      alert("❌ You are not authorized to access this app.");
    } else {
      // Existing user → Allow login
            navigate("/"); // Redirect to dashboard

      console.log("✅ Authorized admin login");
    }

  } catch (error) {
    console.error(error);
    alert("Login failed");
  }
};

  return (
    <div className="bg-white w-full h-screen flex">
      <div className="bg-amber-50 w-[50%] h-screen relative">
        <div
          className="px-3 bg-white w-[80%] h-[90%] absolute top-[5%] right-0 rounded-l-2xl shadow-2xl flex flex-col"
          style={{
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15), 0 1.5px 4px 0 rgba(0,0,0,0.07)"
          , fontFamily:'cursive'          }}
        >
<h4 className="text-xl mt-4 font-semibold tracking-[.2em] text-amber-950 text-center mb-4">Logo</h4>
<h2 className="text-3xl mt-4 font-semibold tracking-[.3em]  text-center mb-4" >YumSlice</h2>
    
      <form onSubmit={handleLogin} className="space-y-4 text-center">
        {/* <label  className="tracking-[.2em]  text-amber-950 text-left mb-2 ">Email</label> */}
        <input
          type="email"
          placeholder="Your Email"
          className="w-[60%] bg-white border-1 border-gray-200 px-3 py-2 mt-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
                {/* <label className="tracking-[.2em]  text-amber-950 text-left mb-5 ">Password</label> */}

        <input
          type="password"
          placeholder="Yout Password"
          className="w-[60%] bg-white border-1 border-gray-200 px-3 py-2 mt-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
    
        <div className="text-center">
          
        <button type="submit" className="w-[60%] mt-2 mx-auto text-center bg-amber-950 text-orange-50  tracking-[.2em] cursor-pointer hover:bg-orange-950 hover:text-amber-50 py-2 rounded">
          Login
        </button>
        </div>

      </form>
       <div class="mx-auto w-[60%] flex items-center gap-4 text-gray-500 my-6">
  <hr class="flex-grow border-t border-gray-300" />
  <span class="text-sm whitespace-nowrap tracking-[.1em]">OR Login with Google</span>
  <hr class="flex-grow border-t border-gray-300" />
</div>
       <button onClick={handleGoogleLogin} className=" cursor-pointer bg-white mx-auto  text-sm  rounded-full"  style={{
            boxShadow: "0 0 12px 0 rgba(31, 38, 135, 0.15),  4px 0 rgba(0,0,0,0.07)"}}> 
            <img src="https://i.pinimg.com/736x/60/41/99/604199df880fb029291ddd7c382e828b.jpg" className="w-10 h-10 rounded-full"></img>
            </button>
        </div>
      </div>
      <div className="bg-amber-950 w-[50%] h-screen relative">
         <div
          className=" w-[80%] h-[90%] absolute top-[5%] left-0 rounded-r-2xl shadow-2xl"
        
        >
          <img src={img1} alt="background" className="w-full h-full rounded-r-2xl"/>
        </div>
      </div>
    {/* <div className="bg-orange-950 text-center mx-auto mt-20 rounded-2xl shadow-md p-10 w-full max-w-md h-[70%]">
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
    </div> */}
    </div>
  );
};

export default LoginPage;
