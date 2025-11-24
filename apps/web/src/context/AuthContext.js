"use client";

import LandingSkeleton from "@/components/LandingSkeleton";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo
} from "react";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState(null);

  // ✅ PUBLIC ROUTES
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/admin-login"
  ];

  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/batchid") ||
    pathname.startsWith("/api/public");

  // ✅ Verify existing token
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
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  // ✅ Admin login handler
  const adminLogin = (token) => {
    setAdminToken(token);
  };

  // ✅ Prevent redirect on public pages
  useEffect(() => {
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
      adminLogin,
    }),
    [user, loading, adminToken]
  );

  if (loading) {
    return (
      <div>
        <LandingSkeleton />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook
export const useAuth = () => useContext(AuthContext);
