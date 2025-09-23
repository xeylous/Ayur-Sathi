"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useMemo } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Run once when app starts
  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch("/api/verify-token", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []);

  const value = useMemo(() => ({ user, setUser, loading }), [user, loading]);
  return (
    
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
