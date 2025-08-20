import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '../components/common/Toast';

const FavouritesContext = createContext();

export const useFavourites = () => {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error('useFavourites must be used within a FavouritesProvider');
  }
  return context;
};

export const FavouritesProvider = ({ children }) => {
  const [favourites, setFavourites] = useState([]);
  const { showSuccess, showInfo } = useToast();

  // Load favourites from localStorage on mount
  useEffect(() => {
    const savedFavourites = localStorage.getItem('favouriteProperties');
    if (savedFavourites) {
      setFavourites(JSON.parse(savedFavourites));
    }
  }, []);

  const toggleFavourite = (property) => {
    const isAlreadyFavourite = favourites.some(fav => fav.id === property.id);
    let updatedFavourites;
    let message;
    
    if (isAlreadyFavourite) {
      updatedFavourites = favourites.filter(fav => fav.id !== property.id);
      message = `${property.title} removed from favourites`;
    } else {
      updatedFavourites = [...favourites, property];
      message = `${property.title} added to favourites`;
    }
    
    setFavourites(updatedFavourites);
    localStorage.setItem('favouriteProperties', JSON.stringify(updatedFavourites));
    
    // Show toast notification
    if (isAlreadyFavourite) {
      showInfo(message);
    } else {
      showSuccess(message);
    }
    
    return !isAlreadyFavourite;
  };

  const removeFavourite = (propertyId) => {
    const updatedFavourites = favourites.filter(fav => fav.id !== propertyId);
    setFavourites(updatedFavourites);
    localStorage.setItem('favouriteProperties', JSON.stringify(updatedFavourites));
  };

  const clearAllFavourites = () => {
    setFavourites([]);
    localStorage.removeItem('favouriteProperties');
  };

  const isFavourite = (propertyId) => {
    return favourites.some(fav => fav.id === propertyId);
  };

  const getFavouritesCount = () => {
    return favourites.length;
  };

  const value = {
    favourites,
    toggleFavourite,
    removeFavourite,
    clearAllFavourites,
    isFavourite,
    getFavouritesCount
  };

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
};

export default FavouritesContext;
