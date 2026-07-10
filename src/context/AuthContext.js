// "use client";

// import LandingSkeleton from "@/components/LandingSkeleton";
// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useMemo,
//   use
// } from "react";
// import { useRouter, usePathname } from "next/navigation";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [adminToken, setAdminToken] = useState(null);

//   // 🔹 Add missing public routes
//   const publicRoutes = [
//     "/",
//     "/login",
//     "/register",
//     "/admin-login",
//     "/explore",
//     "/marketplace",
//     "/herbslib",
//     "/blog"
//   ];

//   const isPublicRoute =
//     publicRoutes.includes(pathname) ||
//     pathname.startsWith("/batchid") ||
//     pathname.startsWith("/api/public");

//   useEffect(() => {
//     const verify = async () => {
//       try {
//         const res = await fetch("/api/verify-token", {
//           credentials: "include",
//         });

//         if (res.ok) {
//           const data = await res.json();
//           setUser(data.user);
//         } else {
//           setUser(null);
//         }
//       } catch {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     verify();
//   }, []);

//   useEffect(() => {
//   const SERVER_URL = "https://ayurgyani.onrender.com/ping"; // your backend

//   const pingServer = async () => {
//     try {
//       await fetch(SERVER_URL);
//       console.log("💖 Keep-alive ping sent");
//     } catch (error) {
//       console.log("⚠️ Ping failed:", error);
//     }
//   };

//   // Call immediately when user visits site
//   pingServer();

//   // Continue pinging every 10 minutes
//   const interval = setInterval(pingServer, 10 * 60 * 1000);

//   return () => clearInterval(interval);
// }, []);

//   useEffect(() => {
//     // 🛑 Prevent redirect if route is public
//     if (!loading && !user && !isPublicRoute) {
//       router.push("/login");
//     }
//   }, [user, loading, isPublicRoute, router]);

//   const value = useMemo(
//     () => ({
//       user,
//       setUser,
//       loading,
//       adminToken,
//       loginAdmin: setAdminToken,
//     }),
//     [user, loading, adminToken]
//   );
//   console.log("value",value);
  
//   if (loading) return <LandingSkeleton />;

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import LandingSkeleton from "@/components/LandingSkeleton";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const hydrated = useRef(false); // prevents verify-token from running multiple times

  // ----------------------------
  //  PUBLIC + PROTECTED ROUTES
  // ----------------------------
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/explore",
    "/marketplace",
    "/herbslib",
    "/blog",
    "/admin-login",
    "/google-callback",
  ];

  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/batchid") ||
    pathname.startsWith("/api/public") ||
    pathname.startsWith("/admin");

  // ----------------------------
  //  VERIFY TOKEN — RUNS ONCE
  // ----------------------------
  const verifyUser = async () => {
    if (hydrated.current) return; // prevents duplicate calls
    hydrated.current = true;

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

  useEffect(() => {
    verifyUser();
  }, []);

  // -------------------------------------------
  // AUTO REDIRECTION FOR PROTECTED DASHBOARDS
  // -------------------------------------------
  useEffect(() => {
    if (loading) return;

    if (!user && !isPublicRoute) {
      router.replace("/login");
    }
  }, [loading, user, pathname]);

  // ----------------------------
  //  KEEP SERVER ALIVE — ONCE
  // ----------------------------
  useEffect(() => {
    const SERVER_URL = "https://ayurgyani.onrender.com/ping";

    const pingServer = async () => {
      try {
        await fetch(SERVER_URL);
      } catch {}
    };

    pingServer(); // run once on load

    const interval = setInterval(pingServer, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ----------------------------
  //  REFRESH USER AFTER UPDATE
  // ----------------------------
  const refreshUser = async () => {
    try {
      const res = await fetch("/api/verify-token", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch {}
  };

  // ----------------------------
  //  LOGOUT HANDLER
  // ----------------------------
  const logout = async () => {
    await fetch("/api/logout", { method: "GET" });
    setUser(null);
    router.replace("/login");
  };

  // ----------------------------
  //  ADMIN LOGIN HANDLER
  // ----------------------------
  const adminLogin = async (email, password) => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (err) {
      console.error("Admin login error in context:", err);
      return { success: false, error: "Something went wrong" };
    }
  };

  // ----------------------------
  // MEMOIZED VALUE (prevents rerenders)
  // ----------------------------
  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      refreshUser,
      logout,
      adminLogin,
    }),
    [user, loading]
  );
  // console.log("user",user);
  
  // ----------------------------
  // LOAD SKELETON DURING VERIFY
  // ----------------------------
  if (loading) return <LandingSkeleton />;

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
