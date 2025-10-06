# Server Setup Guide - Fix CORS Issues

## Problem
The React app cannot connect to the PHP API due to CORS errors and server issues.

## Step-by-Step Solution

### 1. Check if XAMPP/WAMP is Running

#### For XAMPP:
1. Open XAMPP Control Panel
2. Make sure **Apache** and **MySQL** services are **STARTED** (green)
3. If not started, click "Start" for both services

#### For WAMP:
1. Open WAMP Server
2. Make sure the WAMP icon is **green** in system tray
3. If red/orange, click on it and start all services

### 2. Verify Server is Working

Open your browser and test these URLs:

1. **Basic Server Test:**
   ```
   http://localhost/
   ```
   Should show Apache welcome page or directory listing

2. **PHP Test:**
   ```
   http://localhost/WDPF/React-project/real-estate-management-system/API/test-simple.php
   ```
   Should return JSON: `{"success":true,"message":"PHP is working",...}`

3. **CORS Test:**
   ```
   http://localhost/WDPF/React-project/real-estate-management-system/API/cors-test.php
   ```
   Should return JSON without CORS errors

### 3. Fix File Paths

Make sure your project is in the correct location:

#### For XAMPP:
```
C:\xampp\htdocs\WDPF\React-project\real-estate-management-system\
```

#### For WAMP:
```
C:\wamp64\www\WDPF\React-project\real-estate-management-system\
```

### 4. Update Environment Variables

Check your `.env` file in the React project root:

```env
VITE_API_URL=http://localhost/WDPF/React-project/real-estate-management-system/API
```

### 5. Test Database Connection

1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Check if `netro-estate` database exists
3. Test database connection:
   ```
   http://localhost/WDPF/React-project/real-estate-management-system/API/test-database.php
   ```

### 6. Alternative API URL (if path is different)

If your project is in a different location, update the API URL in `.env`:

```env
# If project is directly in htdocs/www
VITE_API_URL=http://localhost/real-estate-management-system/API

# If project is in a subfolder
VITE_API_URL=http://localhost/your-folder-name/real-estate-management-system/API
```

### 7. Restart Everything

1. **Stop XAMPP/WAMP services**
2. **Close XAMPP/WAMP completely**
3. **Restart XAMPP/WAMP as Administrator**
4. **Start Apache and MySQL**
5. **Restart React dev server:**
   ```bash
   npm run dev
   ```

### 8. Test API Endpoints

After restarting, test these URLs in your browser:

1. **Agents API:**
   ```
   http://localhost/WDPF/React-project/real-estate-management-system/API/get-agents.php
   ```

2. **Properties API:**
   ```
   http://localhost/WDPF/React-project/real-estate-management-system/API/list-properties-simple.php
   ```

### 9. Common Issues & Solutions

#### Issue: 404 Not Found
**Solution:** Check file path and make sure Apache is serving the correct directory

#### Issue: CORS Error
**Solution:** Make sure CORS headers are set in PHP files (already done)

#### Issue: Database Connection Failed
**Solution:** 
- Check MySQL is running
- Verify database credentials in `API/config.php`
- Import database: `API/netro-estate (10).sql`

#### Issue: PHP Errors
**Solution:** Check Apache error logs in XAMPP/WAMP logs folder

### 10. Alternative: Use Different Port

If port 80 is busy, configure Apache to use a different port:

1. Edit `httpd.conf` in XAMPP/WAMP
2. Change `Listen 80` to `Listen 8080`
3. Update API URL to: `http://localhost:8080/WDPF/React-project/real-estate-management-system/API`

### 11. Quick Test Commands

Run these in your browser to verify everything works:

```
✅ http://localhost/
✅ http://localhost/WDPF/React-project/real-estate-management-system/API/test-simple.php
✅ http://localhost/WDPF/React-project/real-estate-management-system/API/cors-test.php
✅ http://localhost/WDPF/React-project/real-estate-management-system/API/test-database.php
✅ http://localhost/WDPF/React-project/real-estate-management-system/API/get-agents.php
```

All should return JSON responses without errors.

## Final Check

Once everything is working:

1. **React App:** `http://localhost:5173`
2. **API Base:** `http://localhost/WDPF/React-project/real-estate-management-system/API`
3. **Test Booking:** Navigate to a property and try booking

The CORS errors should be completely resolved after following these steps.