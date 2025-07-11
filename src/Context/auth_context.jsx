import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import axios from "axios";

const AuthContext = createContext();
const baseUrl = "https://cakesstorebackend-production.up.railway.app";

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      setAuthUser(firebaseUser);
      setRole("admin"); // All Auth users are admins
    } else {
      setAuthUser(null);
      setRole(null);
    }
    setLoading(false);
  });

  return () => unsubscribe();
}, []);
const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setAuthUser(userCredential.user);
    setRole("admin"); // hardcoded, because all Firebase Auth users are admins
  } catch (err) {
    console.error("Login failed:", err);
    throw new Error("Not authorized"); // Or show a message: "You are not an admin"
  }
};

  const logout = async () => {
  try {
    await signOut(auth);             
    setAuthUser(null);              
    setRole(null);
  } catch (err) {
    console.error("Logout error:", err);
  }
};


  return (
    <AuthContext.Provider value={{ authUser, role, loading, login ,logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
