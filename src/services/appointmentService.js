import config from '../config';

class AppointmentService {
  constructor() {
    this.subscribers = [];
  }

  // Subscribe to appointment status updates
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  // Notify all subscribers of status changes
  notifySubscribers(appointmentId, newStatus) {
    this.subscribers.forEach(callback => {
      callback(appointmentId, newStatus);
    });
  }

  // Submit appointment to backend (for when admin processes cart items)
  async submitAppointment(appointmentData) {
    try {
      const response = await fetch(`${config.API_URL}/book-appointment.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      });
      // Try JSON first; if it fails (e.g., 404 HTML), fall back to text
      let result;
      try {
        result = await response.json();
      } catch (_) {
        const text = await response.text();
        return {
          success: false,
          message: text || 'Failed to submit appointment'
        };
      }
      
      if (response.ok && result.success) {
        return {
          success: true,
          appointmentId: result.appointment_id,
          data: result
        };
      } else {
        return {
          success: false,
          message: result.message || 'Failed to submit appointment'
        };
      }
    } catch (error) {
      console.error('Error submitting appointment:', error);
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  }

  // Check appointment status from backend
  async checkAppointmentStatus(appointmentId) {
    try {
      const response = await fetch(`${config.API_URL}/get-appointment-status.php?id=${appointmentId}`);
      let result;
      try {
        result = await response.json();
      } catch (_) {
        const text = await response.text();
        return {
          success: false,
          message: text || 'Failed to check status'
        };
      }
      
      if (response.ok && result.success) {
        return {
          success: true,
          status: result.data.admin_status,
          data: result.data
        };
      } else {
        return {
          success: false,
          message: result.message || 'Failed to check status'
        };
      }
    } catch (error) {
      console.error('Error checking appointment status:', error);
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  }

  // Sync cart items with backend status
  async syncCartWithBackend(cartItems, updateCartItemStatus) {
    const syncPromises = cartItems
      .filter(item => item.backendId) // Only sync items that have been submitted to backend
      .map(async (item) => {
        const statusCheck = await this.checkAppointmentStatus(item.backendId);
        if (statusCheck.success && statusCheck.status !== item.adminStatus) {
          updateCartItemStatus(item.id, item.status, statusCheck.status);
          this.notifySubscribers(item.id, statusCheck.status);
        }
      });

    await Promise.all(syncPromises);
  }

  // Process cart items by submitting them to backend
  async processCartItems(cartItems, updateCartItemStatus) {
    const processPromises = cartItems
      .filter(item => !item.backendId && item.adminStatus === 'waiting')
      .map(async (item) => {
        const result = await this.submitAppointment(item);
        if (result.success) {
          // Update cart item with backend ID
          updateCartItemStatus(item.id, item.status, item.adminStatus, result.appointmentId);
        }
        return result;
      });

    return await Promise.all(processPromises);
  }
}

// Create singleton instance
const appointmentService = new AppointmentService();
export default appointmentService;
