"use client";
import LandingSkeleton from "@/components/LandingSkeleton";
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState(null);
  console.log("hello", user);

  // Existing token verification
  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch("/api/verify-token", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          console.log("auth context", data);
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

  // New admin login (client-side only)
  const adminLogin = (token) => {
    // you can decode the token here if needed, but we'll trust input for now
    setAdminToken(token);
  };
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const value = useMemo(
    () => ({ user, setUser, loading, adminToken, adminLogin }),
    [user, loading, adminToken]
  );

  if (loading) {
    return (
      <div>
        <LandingSkeleton />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
