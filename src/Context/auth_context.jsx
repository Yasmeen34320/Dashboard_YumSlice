import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import axios from "axios";

const AuthContext = createContext();
const baseUrl = "http://localhost:1000";

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // When app starts or refreshes, check Firebase auth state
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
  //     if (firebaseUser) {
  //       try {
  //         const uid = firebaseUser.uid;
  //         const res = await axios.get(`${baseUrl}/users/uid/${uid}`);
  //         const userData = res.data.data;
  //         setAuthUser(userData);
  //         setRole(userData.role);
  //       } catch (error) {
  //         console.error("Failed to fetch user data from backend:", error);
  //         setAuthUser(null);
  //         setRole(null);
  //       }
  //     } else {
  //       setAuthUser(null);
  //       setRole(null);
  //     }
  //     setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, []);

  // const login = async (email, password) => {
  //   const userCredential = await signInWithEmailAndPassword(auth, email, password);
  //   const uid = userCredential.user.uid;
  //   const response = await axios.get(`${baseUrl}/users/uid/${uid}`);
  //   const userData = response.data.data;
  //   setAuthUser(userData);
  //   setRole(userData.role);
  // };

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
