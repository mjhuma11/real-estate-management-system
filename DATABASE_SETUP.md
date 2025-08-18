# Database Setup Instructions

## Prerequisites
- XAMPP, WAMP, or MAMP installed
- MySQL/MariaDB running
- PHP 7.4 or higher

## Setup Steps

### 1. Start Your Local Server
- Start Apache and MySQL from your XAMPP/WAMP control panel
- Make sure both services are running

### 2. Create Database
1. Open phpMyAdmin (usually at `http://localhost/phpmyadmin`)
2. Create a new database named `netro-estate`
3. Import the SQL file:
   - Click on the `netro-estate` database
   - Go to "Import" tab
   - Choose file: `API/netro-estate .sql`
   - Click "Go" to import

### 3. Configure Database Connection
The database configuration is already set in `API/config.php`:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'netro-estate');
```

If your MySQL setup is different, update these values accordingly.

### 4. Add Sample Data (Optional)
To populate your database with sample properties:
1. Open your browser
2. Navigate to: `http://localhost/real-estate-management-system/API/sample-data.php`
3. This will insert sample properties, images, and amenities

### 5. Update API Base URL
In `src/services/api.js`, update the API_BASE_URL if needed:
```javascript
const API_BASE_URL = 'http://localhost/real-estate-management-system/API';
```

### 6. Test the Connection
1. Start your React development server: `npm run dev`
2. Open the application in your browser
3. Navigate to the Properties page to see if data loads from the database

## API Endpoints

### Properties
- `GET /properties.php` - Get all properties
- `GET /properties.php?id=1` - Get property by ID
- `GET /properties.php?featured=1` - Get featured properties
- `POST /properties.php` - Create new property

### Projects
- `GET /projects.php` - Get all projects
- `GET /projects.php?id=1` - Get project by ID
- `GET /projects.php?status=ongoing` - Get projects by status

### Locations
- `GET /locations.php` - Get all locations
- `GET /locations.php?type=area` - Get locations by type

### Property Types
- `GET /property-types.php` - Get all property types

### Contact
- `POST /contact.php` - Submit contact form

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure CORS headers are enabled in `config.php`
2. **Database Connection Failed**: Check your MySQL credentials and ensure the service is running
3. **404 Errors**: Verify your file paths and ensure Apache is serving the correct directory
4. **No Data Loading**: Check browser console for API errors and verify database has data

### Testing API Endpoints:
You can test API endpoints directly in your browser:
- `http://localhost/real-estate-management-system/API/properties.php`
- `http://localhost/real-estate-management-system/API/locations.php`

## Database Schema Overview

### Main Tables:
- `properties` - Property listings
- `projects` - Development projects
- `users` - User accounts (admin, agents, customers)
- `locations` - Geographic locations
- `property_types` - Types of properties
- `categories` - Property categories
- `amenities` - Property amenities
- `contact` - Contact form submissions

### Junction Tables:
- `property_amenities` - Links properties to amenities
- `property_images` - Property image galleries
- `user_favorites` - User wishlist items

## Next Steps

After setting up the database:
1. Create admin user accounts
2. Add more sample properties through the admin panel
3. Configure email settings for contact forms
4. Set up image upload functionality
5. Implement user authentication

## Support

If you encounter any issues:
1. Check the browser console for JavaScript errors
2. Check PHP error logs
3. Verify database connection and data
4. Ensure all file permissions are correct