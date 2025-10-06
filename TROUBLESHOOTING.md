# Troubleshooting Guide

## CORS Issues

### Problem
```
Access to fetch at 'http://localhost/WDPF/React-project/real-estate-management-system/API/...' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

### Solutions

#### 1. Check Server Status
Test if your local server is running:
- Open: `http://localhost/WDPF/React-project/real-estate-management-system/API/test-server.php`
- Should return JSON with server status

#### 2. Test CORS Configuration
- Open: `http://localhost/WDPF/React-project/real-estate-management-system/API/cors-test.php`
- Should return success message without CORS errors

#### 3. Test Database Connection
- Open: `http://localhost/WDPF/React-project/real-estate-management-system/API/test-database.php`
- Should show database connection status and table information

#### 4. XAMPP/WAMP Setup
Make sure your local server is properly configured:

1. **Start Services**
   - Start Apache and MySQL in XAMPP/WAMP
   - Verify both services are running (green status)

2. **Check File Permissions**
   - Ensure the API folder has proper read/write permissions
   - On Windows: Right-click folder → Properties → Security

3. **Verify File Paths**
   - Confirm your project is in the correct htdocs folder
   - Path should be: `C:\xampp\htdocs\WDPF\React-project\real-estate-management-system\`

#### 5. Apache Configuration
If CORS still doesn't work, add this to your Apache httpd.conf:

```apache
LoadModule headers_module modules/mod_headers.so
LoadModule rewrite_module modules/mod_rewrite.so

<Directory "C:/xampp/htdocs">
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
</Directory>
```

#### 6. PHP Configuration
Ensure these PHP extensions are enabled in php.ini:
```ini
extension=pdo_mysql
extension=mysqli
extension=curl
```

## Database Issues

### Problem
Database connection errors or missing tables

### Solutions

#### 1. Import Database
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Create database: `netro-estate`
3. Import SQL file: `API/netro-estate (10).sql`

#### 2. Update Database Schema
Run the SQL commands in: `API/update-appointments-table.sql`

#### 3. Check Database Credentials
Verify in `API/config.php`:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'netro-estate');
```

## API Endpoint Issues

### Problem
Specific API endpoints not working

### Test Individual Endpoints

#### Test Agents API
```
GET http://localhost/WDPF/React-project/real-estate-management-system/API/get-agents.php
```

#### Test Booking Creation
```
POST http://localhost/WDPF/React-project/real-estate-management-system/API/create-booking.php
Content-Type: application/json

{
  "user_id": 1,
  "property_id": 17,
  "booking_type": "rent",
  "booking_date": "2025-01-15",
  "monthly_rent_amount": 25000,
  "advance_deposit_amount": 50000
}
```

## React App Issues

### Problem
Frontend not connecting to API

### Solutions

#### 1. Check Environment Variables
Verify in `.env`:
```
VITE_API_URL=http://localhost/WDPF/React-project/real-estate-management-system/API
```

#### 2. Restart Development Server
```bash
npm run dev
```

#### 3. Clear Browser Cache
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache and cookies

## Common Error Messages

### "Failed to fetch"
- Server not running
- Wrong API URL
- CORS not configured

### "Database connection failed"
- MySQL not running
- Wrong database credentials
- Database doesn't exist

### "Property not found"
- Database empty
- Wrong property ID
- SQL import incomplete

## Quick Fixes

1. **Restart everything:**
   - Stop XAMPP/WAMP
   - Start Apache and MySQL
   - Restart React dev server

2. **Check URLs:**
   - API: `http://localhost/WDPF/React-project/real-estate-management-system/API/`
   - React: `http://localhost:5173`

3. **Verify file structure:**
   ```
   C:\xampp\htdocs\WDPF\React-project\real-estate-management-system\
   ├── API/
   │   ├── config.php
   │   ├── get-agents.php
   │   ├── create-booking.php
   │   └── ...
   ├── src/
   └── ...
   ```

## Getting Help

If issues persist:
1. Check browser console for detailed error messages
2. Check Apache error logs in XAMPP/WAMP
3. Test API endpoints directly in browser
4. Verify database has data using phpMyAdmin