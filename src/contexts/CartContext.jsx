import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthContext from './AuthContext';

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
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useContext(AuthContext);

  // Load cart items from localStorage on mount
  useEffect(() => {
    console.log('🛒 CartContext: Component mounted, loading cart from localStorage');
    const loadCartFromStorage = () => {
      try {
        // Check if we need to clear the cart after a successful payment
        const clearCartFlag = localStorage.getItem('clearCartAfterPayment');
        if (clearCartFlag === 'true') {
          console.log('🛒 CartContext: Clearing cart after successful payment');
          localStorage.removeItem('propertyCart');
          localStorage.removeItem('clearCartAfterPayment');
          setCartItems([]);
          setIsInitialized(true);
          return;
        }

        const savedCart = localStorage.getItem('propertyCart');
        console.log('🛒 CartContext: Raw localStorage data:', savedCart);
        
        if (savedCart && savedCart !== 'undefined' && savedCart !== 'null') {
          const parsedCart = JSON.parse(savedCart);
          console.log('🛒 CartContext: Parsed cart data:', parsedCart);
          
          // Validate that parsed data is an array
          if (Array.isArray(parsedCart)) {
            // Filter cart items to only show items for the current user
            const userCartItems = user 
              ? parsedCart.filter(item => item.user_id === user.id)
              : [];
            
            setCartItems(userCartItems);
            console.log('🛒 CartContext: ✅ Successfully loaded', userCartItems.length, 'items from localStorage for user', user?.id);
            return;
          } else {
            console.error('🛒 CartContext: ❌ Invalid cart data format in localStorage (not an array)');
          }
        } else {
          console.log('🛒 CartContext: 📭 No saved cart data found or data is null/undefined');
        }
        
        // If we reach here, either no data or invalid data
        setCartItems([]);
        
      } catch (e) {
        console.error('🛒 CartContext: ❌ Error loading cart data from localStorage:', e);
        // Clear invalid cart data and reset to empty array
        localStorage.removeItem('propertyCart');
        setCartItems([]);
      } finally {
        setIsInitialized(true);
      }
    };

    // Small delay to ensure localStorage is ready
    setTimeout(loadCartFromStorage, 100);
  }, [user]);

  // Save cart items to localStorage whenever cart changes (but only after initialization)
  useEffect(() => {
    // Don't save until cart is initialized from localStorage
    if (!isInitialized) {
      console.log('🛒 CartContext: Skipping save - cart not yet initialized');
      return;
    }
    
    console.log('🛒 CartContext: 💾 Saving cart to localStorage:', cartItems);
    try {
      // Get existing cart data from localStorage
      let existingCartData = [];
      const savedCart = localStorage.getItem('propertyCart');
      if (savedCart && savedCart !== 'undefined' && savedCart !== 'null') {
        try {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            existingCartData = parsedCart;
          }
        } catch (e) {
          console.error('🛒 CartContext: ❌ Error parsing existing cart data:', e);
        }
      }
      
      // Filter out items for current user and add current cart items
      let updatedCartData = existingCartData.filter(item => 
        user ? item.user_id !== user.id : true
      );
      
      // Add current user's cart items
      updatedCartData = [...updatedCartData, ...cartItems];
      
      const cartData = JSON.stringify(updatedCartData);
      localStorage.setItem('propertyCart', cartData);
      console.log('🛒 CartContext: ✅ Successfully saved', cartItems.length, 'items to localStorage for user', user?.id);
      console.log('🛒 CartContext: 📄 Saved data:', cartData);
    } catch (e) {
      console.error('🛒 CartContext: ❌ Error saving cart data to localStorage:', e);
    }
  }, [cartItems, isInitialized, user]);

  const addToCart = async (appointmentData) => {
    console.log('🛒 CartContext: Adding item to cart:', appointmentData);
    
    // Create a temporary ID for the cart item
    const tempId = Date.now();
    
    const newItem = {
      id: tempId, // Temporary ID until submitted to backend
      ...appointmentData,
      user_id: user?.id || null, // Associate with current user
      status: 'pending',
      createdAt: new Date().toISOString(),
      adminStatus: 'waiting', // waiting, accepted, rejected
      bookingFormCompleted: appointmentData.bookingFormCompleted || false, // Track if booking form is filled
      bookingFormData: appointmentData.bookingFormData || null, // Store booking form data when completed
      appointment_id: appointmentData.appointment_id || null, // Store appointment ID if created
      payment_plan_id: appointmentData.payment_plan_id || null // Store payment plan ID if created
    };

    setCartItems(prev => {
      const newCart = [...prev, newItem];
      console.log('🛒 CartContext: New cart items:', newCart);
      return newCart;
    });
    
    console.log('🛒 CartContext: Item added with ID:', tempId);
    return tempId;
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

  const updateCartItemBookingForm = (itemId, bookingFormData) => {
    console.log('🛒 CartContext: Updating booking form for item:', itemId, bookingFormData);
    setCartItems(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            bookingFormCompleted: bookingFormData.bookingFormCompleted || true,
            bookingFormData: bookingFormData.bookingFormData || bookingFormData,
            appointment_id: bookingFormData.appointment_id || item.appointment_id,
            payment_plan_id: bookingFormData.payment_plan_id || item.payment_plan_id,
            updatedAt: new Date().toISOString()
          }
        : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('propertyCart');
  };

  const clearCartAfterPayment = () => {
    // Set flag to clear cart after payment
    localStorage.setItem('clearCartAfterPayment', 'true');
    setCartItems([]);
  };

  // Clear cart after successful booking
  const clearCartAfterBooking = () => {
    setCartItems([]);
    // We don't remove from localStorage here because we want to keep other users' carts
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

  // For property shopping cart, we don't need automatic backend sync
  // Sync will happen only during explicit checkout process
  const syncWithBackend = async () => {
    // Do nothing for property shopping cart
    console.log('Property shopping cart does not require automatic sync');
  };

  // Set up periodic sync with backend - disabled for property shopping cart
  useEffect(() => {
    // Disabled automatic sync for property shopping cart
    // This was causing 400 errors because it was trying to sync property data
    // with an appointment booking API
    console.log('Automatic sync disabled for property shopping cart');
    
    // If you want to re-enable sync in the future, uncomment the code below:
    /*
    const interval = setInterval(() => {
      syncWithBackend();
    }, 30000); // Sync every 30 seconds

    return () => clearInterval(interval);
    */
  }, [cartItems]);

  // Subscribe to appointment service updates - disabled for property shopping cart
  useEffect(() => {
    // Disabled for property shopping cart
    console.log('Appointment service subscription disabled for property shopping cart');
    
    // If you want to re-enable in the future, uncomment the code below:
    /*
    const unsubscribe = appointmentService.subscribe((appointmentId, newStatus) => {
      // Find cart item by backend ID and update status
      setCartItems(prev => prev.map(item => 
        item.backendId === appointmentId 
          ? { ...item, adminStatus: newStatus, updatedAt: new Date().toISOString() }
          : item
      ));
    });

    return unsubscribe;
    */
  }, []);

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateCartItemStatus,
    updateCartItemBookingForm,
    clearCart,
    clearCartAfterPayment,
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