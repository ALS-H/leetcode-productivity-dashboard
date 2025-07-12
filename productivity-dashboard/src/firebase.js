import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBAWGy-6vyVYyNhpE95UuzMHM8GEoLLB24",
  authDomain: "leetcode-productivity-we-f8c3a.firebaseapp.com",
  projectId: "leetcode-productivity-we-f8c3a",
  storageBucket: "leetcode-productivity-we-f8c3a.appspot.com", // ✅ fixed here
  messagingSenderId: "124354134023",
  appId: "1:124354134023:web:a12adca3f8b13a8bf06aa2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
