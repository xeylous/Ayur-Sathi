"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const FarmerContext = createContext();

export function FarmerProvider({ children }) {
  const { user } = useAuth();

  const [farmer, setFarmer] = useState(null);
  const [loadingFarmer, setLoadingFarmer] = useState(true);

  // Fetch farmer profile ONLY when user is available and type is farmer
  useEffect(() => {
    if (!user) {
      setFarmer(null);
      setLoadingFarmer(false);
      return;
    }

    if (user.type !== "farmer") {
      setFarmer(null);
      setLoadingFarmer(false);
      return;
    }

    const fetchFarmer = async () => {
      try {
        const res = await fetch("/api/profile?type=farmer");
        const data = await res.json();

        if (res.ok && data.success) {
          setFarmer(data.profile);
        } else {
          setFarmer(null);
        }
      } catch {
        setFarmer(null);
      } finally {
        setLoadingFarmer(false);
      }
    };

    setLoadingFarmer(true);
    fetchFarmer();
  }, [user]); //  Critical: re-fetch when login changes user

  return (
    <FarmerContext.Provider value={{ farmer, setFarmer, loadingFarmer }}>
      {children}
    </FarmerContext.Provider>
  );
}

export const useFarmer = () => useContext(FarmerContext);
