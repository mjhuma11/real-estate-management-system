import { useState } from 'react';

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBooking = async (bookingData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('API/create-booking.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Booking creation failed');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createBooking,
    loading,
    error
  };
};

export default useBooking;