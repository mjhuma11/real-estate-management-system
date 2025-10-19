# API Endpoints for Dynamic Admin Dashboard

## Required API Endpoints

### 1. Dashboard Statistics
**Endpoint:** `GET /api/dashboard-stats.php`

**Response:**
```json
{
  "success": true,
  "stats": {
    "properties": {
      "total": 150,
      "available": 120,
      "sold": 30,
      "featured": 15,
      "thisMonth": 8
    },
    "projects": {
      "total": 25,
      "ongoing": 10,
      "completed": 12,
      "upcoming": 3
    },
    "users": {
      "total": 500,
      "active": 450,
      "agents": 25,
      "customers": 475,
      "thisMonth": 35
    },
    "bookings": {
      "total": 75,
      "pending": 12,
      "confirmed": 50,
      "thisMonth": 18,
      "revenue": 2500000
    }
  }
}
```

### 2. Recent Activities
**Endpoint:** `GET /api/get-recent-activities.php?filter=all&limit=10`

**Response:**
```json
{
  "success": true,
  "activities": [
    {
      "id": 1,
      "type": "property_added",
      "user_name": "Admin",
      "message": "added new property \"Luxury Apartment in Gulshan\"",
      "icon": "fa-home",
      "color": "text-primary",
      "created_at": "2025-10-16T10:30:00Z",
      "details": {
        "property_title": "Luxury Apartment in Gulshan",
        "property_id": 123
      }
    }
  ]
}
```

### 3. Real-time Notifications
**Endpoint:** `GET /api/get-notifications.php`

**Response:**
```json
{
  "success": true,
  "notifications": [
    {
      "id": 1,
      "type": "booking",
      "title": "New Property Booking",
      "message": "John Doe booked \"Luxury Apartment in Gulshan\"",
      "time": "2025-10-16T10:25:00Z",
      "read": false,
      "icon": "fa-calendar-check",
      "color": "success"
    }
  ],
  "unread_count": 3
}
```

### 4. Users Management
**Endpoint:** `GET /api/get-users.php?page=1&limit=10&search=&role=&status=`

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+880 1234 567890",
      "role": "customer",
      "status": "active",
      "joinDate": "2024-01-15",
      "lastLogin": "2025-10-16 09:30:00",
      "propertiesViewed": 15,
      "inquiries": 3,
      "avatar": "https://example.com/avatar.jpg"
    }
  ],
  "total": 500,
  "page": 1,
  "limit": 10
}
```

### 5. User Status Update
**Endpoint:** `POST /api/update-user-status.php`

**Request Body:**
```json
{
  "id": 1,
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User status updated successfully"
}
```

### 6. User Count
**Endpoint:** `GET /api/get-users-count.php`

**Response:**
```json
{
  "success": true,
  "count": 500
}
```

### 7. Mark Notification as Read
**Endpoint:** `POST /api/mark-notification-read.php`

**Request Body:**
```json
{
  "id": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### 8. Mark All Notifications as Read
**Endpoint:** `POST /api/mark-all-notifications-read.php`

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

## Implementation Notes

1. **Real-time Updates**: Consider implementing WebSocket connections or Server-Sent Events for real-time updates
2. **Caching**: Implement caching for frequently accessed data like dashboard statistics
3. **Pagination**: All list endpoints should support pagination
4. **Authentication**: All endpoints should verify admin authentication
5. **Error Handling**: Consistent error response format across all endpoints
6. **Rate Limiting**: Implement rate limiting to prevent abuse

## Database Tables Needed

### notifications
```sql
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  user_id INT,
  read_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### activities
```sql
CREATE TABLE activities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type VARCHAR(50) NOT NULL,
  user_id INT,
  user_name VARCHAR(255),
  message TEXT NOT NULL,
  icon VARCHAR(50),
  color VARCHAR(50),
  details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```