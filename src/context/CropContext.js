"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CropContext = createContext();

export function CropProvider({ children }) {
  const [cachedCrops, setCachedCrops] = useState({});
  const [speciesList, setSpeciesList] = useState([]);
  const [infoList, setInfoList] = useState([]);
  const [isCropsLoading, setIsCropsLoading] = useState(true);

  const refreshCrops = async () => {
    try {
      setIsCropsLoading(true);
      const [resSpecies, resInfo] = await Promise.all([
        fetch("/api/crop-species"),
        fetch("/api/crop-info")
      ]);
      
      const dataSpecies = await resSpecies.json();
      const dataInfo = await resInfo.json();

      if (dataSpecies.success) {
        setSpeciesList(dataSpecies.data);
      }
      if (dataInfo.success) {
        setInfoList(dataInfo.data);
      }
    } catch (err) {
      console.error("Failed to fetch crop data from database", err);
    } finally {
      setIsCropsLoading(false);
    }
  };

  useEffect(() => {
    refreshCrops();
  }, []);

  return (
    <CropContext.Provider value={{ 
      cachedCrops, setCachedCrops, 
      speciesList, infoList, isCropsLoading, refreshCrops
    }}>
      {children}
    </CropContext.Provider>
  );
}

export const useCropCache = () => useContext(CropContext);
