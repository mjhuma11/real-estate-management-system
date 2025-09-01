-- Create amenities table
CREATE TABLE IF NOT EXISTS `amenities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `category` varchar(50) DEFAULT 'general',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create property_amenities junction table
CREATE TABLE IF NOT EXISTS `property_amenities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `property_id` int(11) NOT NULL,
  `amenity_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `property_id` (`property_id`),
  KEY `amenity_id` (`amenity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample amenities
INSERT INTO `amenities` (`name`, `icon`, `category`) VALUES
('Swimming Pool', 'fas fa-swimming-pool', 'recreation'),
('Gym/Fitness Center', 'fas fa-dumbbell', 'recreation'),
('Parking', 'fas fa-car', 'convenience'),
('Security', 'fas fa-shield-alt', 'safety'),
('Elevator', 'fas fa-elevator', 'convenience'),
('Balcony', 'fas fa-home', 'structure'),
('Garden', 'fas fa-leaf', 'outdoor'),
('Playground', 'fas fa-child', 'recreation'),
('CCTV Surveillance', 'fas fa-video', 'safety'),
('Generator Backup', 'fas fa-bolt', 'utilities'),
('Water Supply 24/7', 'fas fa-tint', 'utilities'),
('Internet/WiFi', 'fas fa-wifi', 'utilities'),
('Air Conditioning', 'fas fa-snowflake', 'comfort'),
('Furnished', 'fas fa-couch', 'comfort'),
('Laundry Service', 'fas fa-tshirt', 'convenience'),
('Rooftop Access', 'fas fa-building', 'structure'),
('Prayer Room', 'fas fa-pray', 'convenience'),
('Community Hall', 'fas fa-users', 'recreation'),
('Fire Safety', 'fas fa-fire-extinguisher', 'safety'),
('Waste Management', 'fas fa-trash', 'convenience');

