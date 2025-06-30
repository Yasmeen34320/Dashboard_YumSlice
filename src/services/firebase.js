import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNnm8Pn4mBjdhHWz-ReF1NPOe_yMTgkb8",
  authDomain: "yumslice-2bab2.firebaseapp.com",
  projectId: "yumslice-2bab2",
  storageBucket: "yumslice-2bab2.firebasestorage.app",
  messagingSenderId: "926443017819",
  appId: "1:926443017819:web:b9053d8f5322c078b6917e",
  measurementId: "G-KTEN2V9P98"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
