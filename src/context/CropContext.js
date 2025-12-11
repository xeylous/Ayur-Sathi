"use client";
import { createContext, useContext, useState } from "react";

const CropContext = createContext();

export function CropProvider({ children }) {
  const [cachedCrops, setCachedCrops] = useState({});  

  return (
    <CropContext.Provider value={{ cachedCrops, setCachedCrops }}>
      {children}
    </CropContext.Provider>
  );
}

export const useCropCache = () => useContext(CropContext);
