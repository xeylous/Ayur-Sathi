// "use client";
// import LandingSkeleton from "@/components/LandingSkeleton";
// import { createContext, useContext, useState, useEffect } from "react";
// import { useMemo } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Run once when app starts
//   useEffect(() => {
//     const verify = async () => {
//       try {
//         const res = await fetch("/api/verify-token", { credentials: "include" });
//         if (res.ok) {
         
//           const data = await res.json();
//           console.log(data);
//           setUser(data.user);
//         } else {
//           setUser(null);
//         }
//       } catch (err) {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     verify();
//   }, []);

//   const value = useMemo(() => ({ user, setUser, loading }), [user, loading]);
//   if (loading) {
//     return (
//       <div >
//        <LandingSkeleton />
//       </div>
//     );
//   }
//   return (
    
//     <AuthContext.Provider value={{ user, setUser, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
"use client";
import LandingSkeleton from "@/components/LandingSkeleton";
import { createContext, useContext, useState, useEffect, useMemo } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState(null);

  // Existing token verification
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

  // New admin login (client-side only)
  const adminLogin = (token) => {
    // you can decode the token here if needed, but we'll trust input for now
    setAdminToken(token);
  };

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
