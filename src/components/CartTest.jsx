import React from 'react';
import { useCart } from '../contexts/CartContext';

const CartTest = () => {
  const { cartItems, addToCart, removeFromCart, clearCart, getCartCount } = useCart();

  const addTestItem = () => {
    const testItem = {
      property_id: Math.floor(Math.random() * 100),
      property_title: `Test Property ${Date.now()}`,
      property_address: 'Test Address, Dhaka',
      booking_type: 'sale',
      booking_date: new Date().toISOString().split('T')[0],
      total_property_price: 5000000,
      down_payment_details: 1000000,
      user_id: 1
    };
    
    addToCart(testItem);
    console.log('🧪 Test item added to cart');
  };

  const checkLocalStorage = () => {
    const savedCart = localStorage.getItem('propertyCart');
    console.log('🧪 Current localStorage data:', savedCart);
    alert(`LocalStorage contains: ${savedCart ? JSON.parse(savedCart).length + ' items' : 'No data'}`);
  };

  return (
    <div className="card mt-3">
      <div className="card-header">
        <h5 className="mb-0">🧪 Cart Test Panel</h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <strong>Current Cart Count:</strong> {getCartCount()}
        </div>
        
        <div className="mb-3">
          <strong>Cart Items:</strong>
          {cartItems.length > 0 ? (
            <ul className="list-group mt-2">
              {cartItems.map(item => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{item.property_title}</strong>
                    <br />
                    <small className="text-muted">{item.booking_type} - {item.booking_date}</small>
                  </div>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted mt-2">No items in cart</p>
          )}
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-primary btn-sm" onClick={addTestItem}>
            Add Test Item
          </button>
          <button className="btn btn-info btn-sm" onClick={checkLocalStorage}>
            Check LocalStorage
          </button>
          <button className="btn btn-warning btn-sm" onClick={() => window.location.reload()}>
            Refresh Page
          </button>
          <button className="btn btn-danger btn-sm" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        <div className="mt-3">
          <small className="text-muted">
            <strong>Instructions:</strong>
            <ol className="mt-1">
              <li>Click "Add Test Item" to add an item to cart</li>
              <li>Click "Refresh Page" to test persistence</li>
              <li>Check browser console for detailed logs</li>
              <li>Use "Check LocalStorage" to see raw data</li>
            </ol>
          </small>
        </div>
      </div>
    </div>
  );
};

export default CartTest;