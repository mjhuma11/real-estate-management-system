import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';

const CartDebug = () => {
  const { cartItems, addToCart, removeFromCart, clearCart, getCartCount } = useCart();
  const [localStorageData, setLocalStorageData] = useState('');

  const refreshLocalStorageData = () => {
    const data = localStorage.getItem('propertyCart');
    setLocalStorageData(data || 'No data');
  };

  useEffect(() => {
    refreshLocalStorageData();
    // Refresh every second to show real-time updates
    const interval = setInterval(refreshLocalStorageData, 1000);
    return () => clearInterval(interval);
  }, []);

  const addTestItem = () => {
    const testItem = {
      property_id: Math.floor(Math.random() * 1000),
      property_title: `Test Property ${Date.now()}`,
      property_address: 'Test Address, Dhaka',
      booking_type: Math.random() > 0.5 ? 'sale' : 'rent',
      booking_date: new Date().toISOString().split('T')[0],
      total_property_price: Math.floor(Math.random() * 10000000),
      monthly_rent_amount: Math.floor(Math.random() * 100000),
      down_payment_details: Math.floor(Math.random() * 2000000),
      advance_deposit_amount: Math.floor(Math.random() * 200000),
      user_id: 1
    };
    
    const itemId = addToCart(testItem);
    console.log('🧪 CartDebug: Added test item with ID:', itemId);
  };

  const addCompletedTestItem = () => {
    const testItem = {
      property_id: Math.floor(Math.random() * 1000),
      property_title: `Completed Form Property ${Date.now()}`,
      property_address: 'Test Address, Dhaka',
      booking_type: Math.random() > 0.5 ? 'sale' : 'rent',
      booking_date: new Date().toISOString().split('T')[0],
      total_property_price: Math.floor(Math.random() * 10000000),
      monthly_rent_amount: Math.floor(Math.random() * 100000),
      down_payment_details: Math.floor(Math.random() * 2000000),
      advance_deposit_amount: Math.floor(Math.random() * 200000),
      user_id: 1,
      bookingFormCompleted: true,
      bookingFormData: { notes: 'Test completed form data' }
    };
    
    const itemId = addToCart(testItem);
    console.log('🧪 CartDebug: Added completed test item with ID:', itemId);
  };

  const testPersistence = () => {
    console.log('🧪 CartDebug: Testing persistence...');
    addTestItem();
    setTimeout(() => {
      console.log('🧪 CartDebug: Refreshing page in 2 seconds...');
      window.location.reload();
    }, 2000);
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('propertyCart');
    refreshLocalStorageData();
    console.log('🧪 CartDebug: Cleared localStorage');
  };

  return (
    <div className="card mt-4 border-warning">
      <div className="card-header bg-warning text-dark">
        <h5 className="mb-0">🐛 Cart Debug Panel</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <h6>Cart Context State:</h6>
            <div className="bg-light p-3 rounded mb-3">
              <strong>Items Count:</strong> {getCartCount()}<br />
              <strong>Items:</strong>
              {cartItems.length > 0 ? (
                <ul className="mt-2 mb-0">
                  {cartItems.map(item => (
                    <li key={item.id} className="small">
                      {item.property_title} ({item.booking_type})
                      <button 
                        className="btn btn-sm btn-outline-danger ms-2"
                        onClick={() => removeFromCart(item.id)}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-muted"> Empty</span>
              )}
            </div>
          </div>
          
          <div className="col-md-6">
            <h6>LocalStorage Data:</h6>
            <div className="bg-light p-3 rounded mb-3" style={{ maxHeight: '200px', overflow: 'auto' }}>
              <pre className="small mb-0">{localStorageData}</pre>
            </div>
          </div>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-primary btn-sm" onClick={addTestItem}>
            Add Test Item (Incomplete)
          </button>
          <button className="btn btn-success btn-sm" onClick={addCompletedTestItem}>
            Add Test Item (Completed)
          </button>
          <button className="btn btn-info btn-sm" onClick={testPersistence}>
            Test Persistence (Add + Refresh)
          </button>
          <button className="btn btn-warning btn-sm" onClick={refreshLocalStorageData}>
            Refresh LocalStorage View
          </button>
          <button className="btn btn-outline-warning btn-sm" onClick={clearLocalStorage}>
            Clear LocalStorage
          </button>
          <button className="btn btn-danger btn-sm" onClick={clearCart}>
            Clear Cart Context
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>

        <div className="mt-3">
          <small className="text-muted">
            <strong>Debug Instructions:</strong>
            <ol className="mt-1 mb-0">
              <li>Add incomplete items - should show booking buttons</li>
              <li>Add completed items - should show "Edit Form" button</li>
              <li>Use "Test Persistence" to add item and auto-refresh page</li>
              <li>Check browser console for detailed logs</li>
              <li>Compare Cart Context State vs LocalStorage Data</li>
            </ol>
          </small>
        </div>
      </div>
    </div>
  );
};

export default CartDebug;