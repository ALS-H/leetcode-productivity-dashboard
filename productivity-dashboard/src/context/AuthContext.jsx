import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getIdToken, signOut } from "firebase/auth";
import { auth } from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("🔥 Firebase user changed:", user);

      if (user) {
        try {
          const idToken = await getIdToken(user, true);
          setUser(user);
          setToken(idToken);
          console.log("✅ Firebase token set:", idToken.slice(0, 10) + "...");
        } catch (error) {
          console.error("❌ Failed to get ID token:", error);
        }
      } else {
        setUser(null);
        setToken(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUid(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{user, token, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
