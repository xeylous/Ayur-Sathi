"use client";

import LandingSkeleton from "@/components/LandingSkeleton";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  use
} from "react";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState(null);

  // 🔹 Add missing public routes
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/admin-login",
    "/explore",
    "/marketplace",
    "/herbslib",
    "/blog"
  ];

  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/batchid") ||
    pathname.startsWith("/api/public");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch("/api/verify-token", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  useEffect(() => {
  const SERVER_URL = "https://ayurgyani.onrender.com/ping"; // your backend

  const pingServer = async () => {
    try {
      await fetch(SERVER_URL);
      console.log("💖 Keep-alive ping sent");
    } catch (error) {
      console.log("⚠️ Ping failed:", error);
    }
  };

  // Call immediately when user visits site
  pingServer();

  // Continue pinging every 10 minutes
  const interval = setInterval(pingServer, 10 * 60 * 1000);

  return () => clearInterval(interval);
}, []);

  useEffect(() => {
    // 🛑 Prevent redirect if route is public
    if (!loading && !user && !isPublicRoute) {
      router.push("/login");
    }
  }, [user, loading, isPublicRoute, router]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      adminToken,
      loginAdmin: setAdminToken,
    }),
    [user, loading, adminToken]
  );

  if (loading) return <LandingSkeleton />;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
