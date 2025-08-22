import React, { createContext, useContext, useState, useEffect } from 'react';
import appointmentService from '../services/appointmentService';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart items from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('appointmentCart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart items to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('appointmentCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (appointmentData) => {
    const newItem = {
      id: Date.now(), // Temporary ID until submitted to backend
      ...appointmentData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      adminStatus: 'waiting' // waiting, accepted, rejected
    };

    setCartItems(prev => [...prev, newItem]);
    return newItem.id;
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateCartItemStatus = (itemId, status, adminStatus = null, backendId = null) => {
    setCartItems(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            status, 
            adminStatus: adminStatus || item.adminStatus,
            backendId: backendId || item.backendId,
            updatedAt: new Date().toISOString()
          }
        : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartCount = () => {
    return cartItems.length;
  };

  const getPendingCount = () => {
    return cartItems.filter(item => item.adminStatus === 'waiting').length;
  };

  const getAcceptedCount = () => {
    return cartItems.filter(item => item.adminStatus === 'accepted').length;
  };

  const getRejectedCount = () => {
    return cartItems.filter(item => item.adminStatus === 'rejected').length;
  };

  const syncWithBackend = async () => {
    if (cartItems.length > 0) {
      setLoading(true);
      try {
        // Process new items (submit to backend)
        await appointmentService.processCartItems(cartItems, updateCartItemStatus);
        
        // Sync existing items with backend status
        await appointmentService.syncCartWithBackend(cartItems, updateCartItemStatus);
      } catch (error) {
        console.error('Error syncing with backend:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Set up periodic sync with backend
  useEffect(() => {
    const interval = setInterval(() => {
      syncWithBackend();
    }, 30000); // Sync every 30 seconds

    return () => clearInterval(interval);
  }, [cartItems]);

  // Subscribe to appointment service updates
  useEffect(() => {
    const unsubscribe = appointmentService.subscribe((appointmentId, newStatus) => {
      // Find cart item by backend ID and update status
      setCartItems(prev => prev.map(item => 
        item.backendId === appointmentId 
          ? { ...item, adminStatus: newStatus, updatedAt: new Date().toISOString() }
          : item
      ));
    });

    return unsubscribe;
  }, []);

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateCartItemStatus,
    clearCart,
    getCartCount,
    getPendingCount,
    getAcceptedCount,
    getRejectedCount,
    syncWithBackend,
    setLoading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
