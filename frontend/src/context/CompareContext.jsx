import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [comparedFarmerIds, setComparedFarmerIds] = useState(() => {
    try {
      const saved = localStorage.getItem('krishi_compared_farmers');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('krishi_compared_farmers', JSON.stringify(comparedFarmerIds));
  }, [comparedFarmerIds]);

  const addFarmerToCompare = (farmerId) => {
    const id = farmerId.toString();
    if (comparedFarmerIds.includes(id)) {
      return { success: false, message: 'Farmer already in comparison.' };
    }
    if (comparedFarmerIds.length >= 4) {
      return { success: false, message: 'Maximum 4 farmers can be compared at once.' };
    }
    setComparedFarmerIds((prev) => [...prev, id]);
    return { success: true, message: 'Added to comparison!' };
  };

  const removeFarmerFromCompare = (farmerId) => {
    const id = farmerId.toString();
    setComparedFarmerIds((prev) => prev.filter((item) => item !== id));
  };

  const clearCompare = () => {
    setComparedFarmerIds([]);
  };

  const isInCompare = (farmerId) => {
    return comparedFarmerIds.includes(farmerId?.toString());
  };

  return (
    <CompareContext.Provider
      value={{
        comparedFarmerIds,
        addFarmerToCompare,
        removeFarmerFromCompare,
        clearCompare,
        isInCompare,
        count: comparedFarmerIds.length
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};