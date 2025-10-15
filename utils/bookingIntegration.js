// Integration utility for existing booking forms
export const integratePaymentSystem = (bookingFormElement, PaymentSystemComponent) => {
  // Function to handle booking form submission
  const handleBookingSubmit = async (formData) => {
    try {
      // Create booking via API
      const response = await fetch('API/create-booking.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        // Show payment system
        showPaymentSystem(result.data.payment_plan_id);
        return result.data;
      } else {
        throw new Error(result.error || 'Booking creation failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      throw error;
    }
  };

  // Function to show payment system modal
  const showPaymentSystem = (paymentPlanId) => {
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.id = 'payment-system-modal';
    document.body.appendChild(modalContainer);

    // Render React component (if using React)
    if (window.React && window.ReactDOM) {
      const PaymentSystem = PaymentSystemComponent;
      
      window.ReactDOM.render(
        window.React.createElement(PaymentSystem, {
          paymentPlanId: paymentPlanId,
          onClose: () => {
            document.body.removeChild(modalContainer);
          }
        }),
        modalContainer
      );
    }
  };

  // Add event listener to existing form
  if (bookingFormElement) {
    bookingFormElement.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(bookingFormElement);
      const bookingData = Object.fromEntries(formData.entries());
      
      try {
        await handleBookingSubmit(bookingData);
      } catch (error) {
        // Handle error (show alert, etc.)
        alert('Booking failed: ' + error.message);
      }
    });
  }

  return {
    handleBookingSubmit,
    showPaymentSystem
  };
};

// Vanilla JavaScript integration for non-React forms
export const vanillaIntegration = {
  init: (formSelector) => {
    const form = document.querySelector(formSelector);
    
    if (!form) {
      console.error('Booking form not found');
      return;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const bookingData = Object.fromEntries(formData.entries());
      
      try {
        // Show loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        // Create booking
        const response = await fetch('API/create-booking.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData)
        });

        const result = await response.json();

        if (result.success) {
          // Redirect to payment page or show payment modal
          window.location.href = `payment.html?plan_id=${result.data.payment_plan_id}`;
        } else {
          throw new Error(result.error || 'Booking creation failed');
        }
      } catch (error) {
        alert('Booking failed: ' + error.message);
        
        // Reset button
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
};

export default {
  integratePaymentSystem,
  vanillaIntegration
};