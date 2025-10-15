-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 12, 2025 at 09:36 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `netro-estate`
--

-- --------------------------------------------------------

--
-- Table structure for table `agent_profiles`
--

CREATE TABLE `agent_profiles` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `license_number` varchar(100) DEFAULT NULL,
  `license_expiry` date DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `company_address` text DEFAULT NULL,
  `experience_years` int(11) DEFAULT NULL,
  `commission_rate` decimal(5,2) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT 0.00,
  `total_reviews` int(11) DEFAULT 0,
  `properties_sold` int(11) DEFAULT 0,
  `properties_rented` int(11) DEFAULT 0,
  `verification_status` enum('pending','verified','rejected') DEFAULT 'pending',
  `verified_at` timestamp NULL DEFAULT NULL,
  `verified_by` int(10) UNSIGNED DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `agent_profiles`
--

INSERT INTO `agent_profiles` (`id`, `user_id`, `license_number`, `license_expiry`, `company_name`, `company_address`, `experience_years`, `commission_rate`, `rating`, `total_reviews`, `properties_sold`, `properties_rented`, `verification_status`, `verified_at`, `verified_by`, `is_featured`, `created_at`, `updated_at`) VALUES
(0, 3, 'TEST123', NULL, 'Test Agency', NULL, NULL, NULL, 0.00, 0, 0, 0, 'verified', NULL, NULL, 0, '2025-09-02 16:35:50', '2025-09-02 16:35:50');

-- --------------------------------------------------------

--
-- Table structure for table `amenities`
--

CREATE TABLE `amenities` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `category` varchar(50) DEFAULT 'general',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `amenities`
--

INSERT INTO `amenities` (`id`, `name`, `icon`, `category`, `status`, `created_at`) VALUES
(1, 'Swimming Pool', 'fas fa-swimming-pool', 'recreation', 'active', '2025-09-01 18:23:28'),
(2, 'Gym/Fitness Center', 'fas fa-dumbbell', 'recreation', 'active', '2025-09-01 18:23:28'),
(3, 'Parking', 'fas fa-car', 'convenience', 'active', '2025-09-01 18:23:28'),
(4, 'Security', 'fas fa-shield-alt', 'safety', 'active', '2025-09-01 18:23:28'),
(6, 'Balcony', 'fas fa-home', 'structure', 'active', '2025-09-01 18:23:28'),
(7, 'Garden', 'fas fa-leaf', 'outdoor', 'active', '2025-09-01 18:23:28'),
(8, 'Playground', 'fas fa-child', 'recreation', 'active', '2025-09-01 18:23:28'),
(9, 'CCTV Surveillance', 'fas fa-video', 'safety', 'active', '2025-09-01 18:23:28'),
(10, 'Generator Backup', 'fas fa-bolt', 'utilities', 'active', '2025-09-01 18:23:28'),
(11, 'Water Supply 24/7', 'fas fa-tint', 'utilities', 'active', '2025-09-01 18:23:28'),
(12, 'Internet/WiFi', 'fas fa-wifi', 'utilities', 'active', '2025-09-01 18:23:28'),
(13, 'Air Conditioning', 'fas fa-snowflake', 'comfort', 'active', '2025-09-01 18:23:28'),
(16, 'Rooftop Access', 'fas fa-building', 'structure', 'active', '2025-09-01 18:23:28'),
(17, 'Prayer Room', 'fas fa-pray', 'convenience', 'active', '2025-09-01 18:23:28'),
(18, 'Community Hall', 'fas fa-users', 'recreation', 'active', '2025-09-01 18:23:28'),
(19, 'Fire Safety', 'fas fa-fire-extinguisher', 'safety', 'active', '2025-09-01 18:23:28'),
(20, 'Waste Management', 'fas fa-trash', 'convenience', 'active', '2025-09-01 18:23:28');

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `agent_id` bigint(20) DEFAULT NULL,
  `property_id` bigint(20) NOT NULL,
  `booking_type` enum('rent','sale') NOT NULL,
  `total_property_price` decimal(15,2) DEFAULT NULL,
  `booking_money_amount` decimal(15,2) DEFAULT NULL,
  `installment_option` varchar(255) DEFAULT NULL,
  `down_payment_details` decimal(15,2) DEFAULT NULL,
  `registration_cost_responsibility` varchar(100) DEFAULT NULL,
  `handover_date` date DEFAULT NULL,
  `developer_info` varchar(255) DEFAULT NULL,
  `previous_ownership_info` text DEFAULT NULL,
  `monthly_rent_amount` decimal(15,2) DEFAULT NULL,
  `advance_deposit_amount` decimal(15,2) DEFAULT NULL,
  `security_deposit_details` varchar(255) DEFAULT NULL,
  `maintenance_responsibility` varchar(100) DEFAULT NULL,
  `utility_bills_responsibility` varchar(255) DEFAULT NULL,
  `emergency_contact` varchar(100) DEFAULT NULL,
  `family_members_count` int(11) DEFAULT NULL,
  `booking_date` date NOT NULL,
  `status` enum('pending','confirmed','cancelled','completed') DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `user_id`, `agent_id`, `property_id`, `booking_type`, `total_property_price`, `booking_money_amount`, `installment_option`, `down_payment_details`, `registration_cost_responsibility`, `handover_date`, `developer_info`, `previous_ownership_info`, `monthly_rent_amount`, `advance_deposit_amount`, `security_deposit_details`, `maintenance_responsibility`, `utility_bills_responsibility`, `emergency_contact`, `family_members_count`, `booking_date`, `status`, `notes`, `created_at`, `updated_at`) VALUES
(2, 9, NULL, 17, 'rent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 30000.00, 12345.00, NULL, 'Tenant', NULL, NULL, NULL, '2025-10-06', 'confirmed', '', '2025-10-06 15:08:53', '2025-10-06 15:32:14'),
(3, 9, NULL, 16, 'sale', 55500000.00, 5500000.00, '24_months', 500000000.00, 'Buyer', '2026-10-06', '23,Gulsan, Dhaka, Bangladesh\n\n+880-1754-567890', '23,Gulsan, Dhaka, Bangladesh\n\n+880-1754-567890', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-06', 'confirmed', 'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s', '2025-10-06 15:23:53', '2025-10-06 15:32:10'),
(4, 6, NULL, 14, 'sale', 850000000.00, 50000000.00, NULL, 800000000.00, 'Buyer', '2027-10-13', '23,Gulsan, Dhaka, Bangladesh\n\n+880-1754-567890', '23,Gulsan, Dhaka, Bangladesh\n\n+880-1754-567890', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-06', 'confirmed', 'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s', '2025-10-06 15:25:56', '2025-10-06 15:31:50'),
(5, 9, NULL, 17, 'rent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 30000.00, 20000.00, NULL, 'Owner', NULL, NULL, NULL, '2025-10-07', 'confirmed', '', '2025-10-07 16:12:37', '2025-10-07 16:15:13'),
(6, 9, NULL, 17, 'rent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 30000.00, 60000.00, NULL, NULL, NULL, NULL, NULL, '2025-10-07', 'pending', '', '2025-10-07 16:49:39', '2025-10-07 16:49:39'),
(7, 9, NULL, 14, 'sale', 850000000.00, 50000000.00, '12_months', 800000000.00, 'Buyer', '2026-06-16', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-07', 'pending', '', '2025-10-07 16:57:02', '2025-10-07 16:57:02'),
(8, 9, NULL, 7, 'sale', 75000000.00, 5000000.00, '24_months', 70000000.00, 'Buyer', '2025-06-04', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-07', 'pending', '', '2025-10-07 17:28:39', '2025-10-07 17:28:39'),
(9, 9, NULL, 16, 'sale', 55500000.00, 5500000.00, NULL, 50000000.00, 'Buyer', '2026-11-28', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-07', 'pending', '', '2025-10-07 17:47:27', '2025-10-07 17:47:27'),
(10, 9, NULL, 10, 'sale', 200000.00, 34546.00, NULL, 4535646.00, 'Buyer', '2026-07-29', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-07', 'pending', '', '2025-10-07 17:51:00', '2025-10-07 17:51:00'),
(11, 9, NULL, 17, 'rent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 30000.00, 6774.00, NULL, 'Tenant', NULL, NULL, NULL, '2025-10-07', 'pending', '', '2025-10-07 18:03:06', '2025-10-07 18:03:06'),
(12, 9, NULL, 10, 'sale', 200000.00, 200000.00, NULL, NULL, 'Buyer', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-07', 'pending', '', '2025-10-07 18:51:16', '2025-10-07 18:51:16'),
(13, 6, NULL, 16, 'sale', 55500000.00, 56767.00, NULL, NULL, 'Buyer', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-07', 'pending', '', '2025-10-07 20:12:21', '2025-10-07 20:12:21'),
(14, 6, NULL, 17, 'rent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 30000.00, 20000.00, 'hhhhhhhhhhb', 'Shared', 'owner', NULL, NULL, '2025-10-12', 'pending', 'gfvghghv', '2025-10-12 14:11:26', '2025-10-12 14:11:26'),
(15, 6, NULL, 17, 'rent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 30000.00, 5433.00, NULL, 'Tenant', NULL, NULL, NULL, '2025-10-12', 'pending', '', '2025-10-12 14:12:23', '2025-10-12 14:12:23'),
(16, 6, NULL, 17, 'rent', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 30000.00, 19999.00, 'tut', 'Owner', 'tuyt', NULL, NULL, '2025-10-12', 'pending', 'tut', '2025-10-12 14:38:21', '2025-10-12 14:38:21');

-- --------------------------------------------------------

--
-- Table structure for table `billing_information`
--

CREATE TABLE `billing_information` (
  `id` int(11) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `zip_code` varchar(20) NOT NULL,
  `country` varchar(100) NOT NULL DEFAULT 'Bangladesh',
  `is_default` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(254) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `installment_schedules`
--

CREATE TABLE `installment_schedules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `payment_plan_id` bigint(20) UNSIGNED NOT NULL,
  `appointment_id` bigint(20) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `installment_number` int(11) NOT NULL,
  `installment_amount` decimal(15,2) NOT NULL,
  `due_date` date NOT NULL,
  `paid_date` date DEFAULT NULL,
  `paid_amount` decimal(15,2) DEFAULT 0.00,
  `payment_transaction_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status` enum('pending','paid','overdue','partial','waived') DEFAULT 'pending',
  `late_fee` decimal(10,2) DEFAULT 0.00,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(100) DEFAULT 'location',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `name`, `type`, `created_at`) VALUES
(1, 'Gulshan', 'area', '2025-08-19 02:05:12'),
(3, 'Uttara', 'area', '2025-08-19 02:05:12'),
(4, 'Banani', 'area', '2025-08-19 02:05:12'),
(5, 'Bashundhara', 'area', '2025-08-19 02:05:12'),
(6, 'Motijheel', 'area', '2025-08-19 02:05:12'),
(8, 'Mirpur', 'area', '2025-08-19 02:05:12'),
(10, 'Mymensingh', 'area', '2025-08-25 13:40:47');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `billing_id` int(11) NOT NULL,
  `payment_method_id` int(11) DEFAULT NULL,
  `order_number` varchar(50) NOT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `status` enum('pending','confirmed','processing','completed','cancelled') NOT NULL DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `property_id` int(11) DEFAULT NULL,
  `appointment_id` bigint(20) DEFAULT NULL,
  `item_type` enum('property_booking','property_rental') NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `item_description` text DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `unit_price` decimal(15,2) NOT NULL,
  `total_price` decimal(15,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_invoices`
--

CREATE TABLE `payment_invoices` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `invoice_number` varchar(50) NOT NULL,
  `payment_plan_id` bigint(20) UNSIGNED NOT NULL,
  `appointment_id` bigint(20) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `property_id` int(11) NOT NULL,
  `invoice_type` enum('down_payment','installment','rent','advance','full_payment','other') NOT NULL,
  `invoice_date` date NOT NULL,
  `due_date` date NOT NULL,
  `subtotal` decimal(15,2) NOT NULL,
  `tax_amount` decimal(10,2) DEFAULT 0.00,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `late_fee` decimal(10,2) DEFAULT 0.00,
  `total_amount` decimal(15,2) NOT NULL,
  `paid_amount` decimal(15,2) DEFAULT 0.00,
  `due_amount` decimal(15,2) GENERATED ALWAYS AS (`total_amount` - `paid_amount`) STORED,
  `invoice_status` enum('draft','sent','paid','partial','overdue','cancelled') DEFAULT 'draft',
  `payment_status` enum('unpaid','partial','paid') DEFAULT 'unpaid',
  `invoice_pdf_url` varchar(500) DEFAULT NULL,
  `sent_at` timestamp NULL DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `terms_conditions` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_methods`
--

CREATE TABLE `payment_methods` (
  `id` int(11) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `payment_type` enum('cash','card','bank_transfer') NOT NULL,
  `card_number_last4` varchar(4) DEFAULT NULL,
  `card_expiry` varchar(10) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_plans`
--

CREATE TABLE `payment_plans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `appointment_id` bigint(20) NOT NULL,
  `property_id` int(11) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `booking_type` enum('sale','rent') NOT NULL,
  `total_property_price` decimal(15,2) DEFAULT NULL,
  `down_payment_amount` decimal(15,2) DEFAULT NULL,
  `down_payment_paid` tinyint(1) DEFAULT 0,
  `down_payment_date` date DEFAULT NULL,
  `installment_amount` decimal(15,2) DEFAULT NULL,
  `installment_frequency` enum('monthly','quarterly','yearly') DEFAULT 'monthly',
  `total_installments` int(11) DEFAULT NULL,
  `installments_paid` int(11) DEFAULT 0,
  `next_installment_date` date DEFAULT NULL,
  `monthly_rent_amount` decimal(15,2) DEFAULT NULL,
  `advance_deposit_amount` decimal(15,2) DEFAULT NULL,
  `security_deposit_amount` decimal(15,2) DEFAULT NULL,
  `advance_paid` tinyint(1) DEFAULT 0,
  `advance_payment_date` date DEFAULT NULL,
  `rent_start_date` date DEFAULT NULL,
  `rent_end_date` date DEFAULT NULL,
  `next_rent_due_date` date DEFAULT NULL,
  `total_amount_paid` decimal(15,2) DEFAULT 0.00,
  `total_amount_due` decimal(15,2) DEFAULT 0.00,
  `payment_status` enum('pending','partial','completed','overdue') DEFAULT 'pending',
  `plan_status` enum('active','completed','cancelled','suspended') DEFAULT 'active',
  `registration_cost` decimal(15,2) DEFAULT NULL,
  `registration_paid` tinyint(1) DEFAULT 0,
  `maintenance_charge` decimal(15,2) DEFAULT NULL,
  `utility_responsibility` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payment_plans`
--

INSERT INTO `payment_plans` (`id`, `appointment_id`, `property_id`, `user_id`, `booking_type`, `total_property_price`, `down_payment_amount`, `down_payment_paid`, `down_payment_date`, `installment_amount`, `installment_frequency`, `total_installments`, `installments_paid`, `next_installment_date`, `monthly_rent_amount`, `advance_deposit_amount`, `security_deposit_amount`, `advance_paid`, `advance_payment_date`, `rent_start_date`, `rent_end_date`, `next_rent_due_date`, `total_amount_paid`, `total_amount_due`, `payment_status`, `plan_status`, `registration_cost`, `registration_paid`, `maintenance_charge`, `utility_responsibility`, `notes`, `created_at`, `updated_at`) VALUES
(1, 6, 17, 9, 'rent', NULL, NULL, 0, NULL, NULL, 'monthly', NULL, 0, NULL, 30000.00, 60000.00, NULL, 0, NULL, NULL, NULL, NULL, 0.00, 0.00, 'pending', 'active', NULL, 0, NULL, NULL, '', '2025-10-07 16:49:39', '2025-10-07 16:49:39'),
(2, 7, 14, 9, 'sale', 850000000.00, 800000000.00, 0, NULL, NULL, 'monthly', NULL, 0, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0.00, 0.00, 'pending', 'active', NULL, 0, NULL, NULL, '', '2025-10-07 16:57:03', '2025-10-07 16:57:03'),
(3, 8, 7, 9, 'sale', 75000000.00, 70000000.00, 0, NULL, NULL, 'monthly', NULL, 0, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0.00, 0.00, 'pending', 'active', NULL, 0, NULL, NULL, '', '2025-10-07 17:28:39', '2025-10-07 17:28:39'),
(4, 9, 16, 9, 'sale', 55500000.00, 50000000.00, 0, NULL, NULL, 'monthly', NULL, 0, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0.00, 0.00, 'pending', 'active', NULL, 0, NULL, NULL, '', '2025-10-07 17:47:27', '2025-10-07 17:47:27'),
(5, 10, 10, 9, 'sale', 200000.00, 4535646.00, 0, NULL, NULL, 'monthly', NULL, 0, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0.00, 0.00, 'pending', 'active', NULL, 0, NULL, NULL, '', '2025-10-07 17:51:00', '2025-10-07 17:51:00'),
(6, 11, 17, 9, 'rent', NULL, NULL, 0, NULL, NULL, 'monthly', NULL, 0, NULL, 30000.00, 6774.00, NULL, 0, NULL, NULL, NULL, NULL, 0.00, 0.00, 'pending', 'active', NULL, 0, NULL, NULL, '', '2025-10-07 18:03:06', '2025-10-07 18:03:06'),
(7, 12, 10, 9, 'sale', 200000.00, NULL, 0, NULL, NULL, 'monthly', NULL, 0, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0.00, 0.00, 'pending', 'active', NULL, 0, NULL, NULL, '', '2025-10-07 18:51:16', '2025-10-07 18:51:16'),
(8, 13, 16, 6, 'sale', 55500000.00, NULL, 0, NULL, NULL, 'monthly', NULL, 0, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0.00, 0.00, 'pending', 'active', NULL, 0, NULL, NULL, '', '2025-10-07 20:12:22', '2025-10-07 20:12:22'),
(9, 14, 17, 6, 'rent', NULL, NULL, 0, NULL, NULL, 'monthly', NULL, 0, NULL, 30000.00, 20000.00, NULL, 0, NULL, NULL, NULL, NULL, 0.00, 0.00, 'pending', 'active', NULL, 0, NULL, NULL, 'gfvghghv', '2025-10-12 14:11:27', '2025-10-12 14:11:27'),
(10, 15, 17, 6, 'rent', NULL, NULL, 0, NULL, NULL, 'monthly', NULL, 0, NULL, 30000.00, 5433.00, NULL, 0, NULL, NULL, NULL, NULL, 0.00, 0.00, 'pending', 'active', NULL, 0, NULL, NULL, '', '2025-10-12 14:12:23', '2025-10-12 14:12:23'),
(11, 16, 17, 6, 'rent', NULL, NULL, 0, NULL, NULL, 'monthly', NULL, 0, NULL, 30000.00, 19999.00, NULL, 0, NULL, NULL, NULL, NULL, 0.00, 0.00, 'pending', 'active', NULL, 0, NULL, NULL, 'tut', '2025-10-12 14:38:21', '2025-10-12 14:38:21');

-- --------------------------------------------------------

--
-- Table structure for table `payment_refunds`
--

CREATE TABLE `payment_refunds` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `payment_transaction_id` bigint(20) UNSIGNED NOT NULL,
  `payment_plan_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `refund_amount` decimal(15,2) NOT NULL,
  `refund_reason` text DEFAULT NULL,
  `refund_type` enum('full','partial','security_deposit') NOT NULL,
  `refund_method` enum('cash','bank_transfer','cheque','online','same_as_payment') NOT NULL,
  `refund_reference` varchar(255) DEFAULT NULL,
  `refund_date` date DEFAULT NULL,
  `refund_status` enum('pending','approved','completed','rejected') DEFAULT 'pending',
  `approved_by` int(10) UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_reminders`
--

CREATE TABLE `payment_reminders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `payment_plan_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `reminder_type` enum('installment_due','rent_due','overdue','payment_received','payment_confirmed') NOT NULL,
  `due_date` date DEFAULT NULL,
  `amount` decimal(15,2) DEFAULT NULL,
  `reminder_date` date NOT NULL,
  `notification_method` enum('email','sms','both','system') DEFAULT 'email',
  `sent_status` enum('pending','sent','failed') DEFAULT 'pending',
  `sent_at` timestamp NULL DEFAULT NULL,
  `email_sent` tinyint(1) DEFAULT 0,
  `sms_sent` tinyint(1) DEFAULT 0,
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_transactions`
--

CREATE TABLE `payment_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `payment_plan_id` bigint(20) UNSIGNED NOT NULL,
  `appointment_id` bigint(20) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `property_id` int(11) NOT NULL,
  `transaction_type` enum('down_payment','installment','advance_deposit','security_deposit','monthly_rent','registration','maintenance','utility','refund','penalty','other') NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `payment_method` enum('cash','bank_transfer','cheque','online','card','mobile_banking') NOT NULL,
  `payment_reference` varchar(255) DEFAULT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `account_number` varchar(50) DEFAULT NULL,
  `cheque_number` varchar(50) DEFAULT NULL,
  `mobile_banking_service` varchar(50) DEFAULT NULL,
  `mobile_number` varchar(20) DEFAULT NULL,
  `payment_date` date NOT NULL,
  `due_date` date DEFAULT NULL,
  `installment_number` int(11) DEFAULT NULL,
  `month_year` varchar(20) DEFAULT NULL,
  `payment_status` enum('pending','completed','failed','refunded') DEFAULT 'completed',
  `receipt_number` varchar(100) DEFAULT NULL,
  `receipt_url` varchar(500) DEFAULT NULL,
  `late_fee` decimal(10,2) DEFAULT 0.00,
  `discount` decimal(10,2) DEFAULT 0.00,
  `net_amount` decimal(15,2) GENERATED ALWAYS AS (`amount` - `discount` + `late_fee`) STORED,
  `notes` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `approved_by` int(10) UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `status` enum('planning','ongoing','completed','upcoming') DEFAULT 'planning',
  `category_id` int(11) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `completion_percentage` decimal(5,2) DEFAULT 0.00,
  `total_units` int(11) DEFAULT NULL,
  `available_units` int(11) DEFAULT NULL,
  `min_price` decimal(15,2) DEFAULT NULL,
  `max_price` decimal(15,2) DEFAULT NULL,
  `developer_id` int(10) UNSIGNED DEFAULT NULL,
  `land_area` decimal(10,2) DEFAULT NULL,
  `built_area` decimal(10,2) DEFAULT NULL,
  `total_floors` int(11) DEFAULT NULL,
  `featured` tinyint(1) DEFAULT 0,
  `brochure_url` varchar(500) DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `properties`
--

CREATE TABLE `properties` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(15,2) DEFAULT NULL,
  `monthly_rent` decimal(15,2) DEFAULT NULL,
  `type` enum('For Sale','For Rent') NOT NULL,
  `property_type_id` int(11) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `bedrooms` int(11) DEFAULT NULL,
  `bathrooms` int(11) DEFAULT NULL,
  `area` int(11) DEFAULT NULL,
  `area_unit` enum('sq_ft','sq_m','katha','bigha') DEFAULT 'sq_ft',
  `floor` int(11) DEFAULT NULL,
  `total_floors` int(11) DEFAULT NULL,
  `facing` enum('North','South','East','West','North-East','North-West','South-East','South-West') DEFAULT NULL,
  `parking` int(11) DEFAULT 0,
  `balcony` int(11) DEFAULT 0,
  `status` enum('available','sold','rented','pending') DEFAULT 'available',
  `featured` tinyint(1) DEFAULT 0,
  `agent_id` int(10) UNSIGNED DEFAULT NULL,
  `views` int(11) DEFAULT 0,
  `image` varchar(500) DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `properties`
--

INSERT INTO `properties` (`id`, `title`, `slug`, `description`, `price`, `monthly_rent`, `type`, `property_type_id`, `address`, `bedrooms`, `bathrooms`, `area`, `area_unit`, `floor`, `total_floors`, `facing`, `parking`, `balcony`, `status`, `featured`, `agent_id`, `views`, `image`, `created_by`, `created_at`, `updated_at`) VALUES
(6, 'Luxury Villa', 'luxury-villa', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy.', 30000000.00, 600000.00, 'For Rent', 3, 'bashundara, Dhaka', 5, 5, 4600, 'sq_ft', NULL, 2, 'West', 2, 4, 'available', 1, NULL, 0, 'uploads/properties/68ab1e52ce033_1756044882.jpg', NULL, '2025-08-19 19:04:50', '2025-08-27 01:10:39'),
(7, 'Multi storied building', 'multi-storied-building', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy.', 75000000.00, NULL, 'For Sale', NULL, 'Bashundhara, Dhaka', 7, 3, 4600, 'sq_ft', 4, 19, 'South-West', 3, 3, 'available', 1, NULL, 0, 'uploads/properties/68a4d6a510973_1755633317.jpg', NULL, '2025-08-19 19:55:17', '2025-08-24 19:05:19'),
(8, 'Luxuary apartment', 'luxuary-apartment', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.', 35000000.00, 400000.00, 'For Sale', 1, 'Gulshan, Dhaka', 4, 3, 3560, 'sq_ft', 2, 3, 'South-East', 2, 3, 'available', 1, 2, 0, 'uploads/properties/68a4e86ba17d7_1755637867.jpg', NULL, '2025-08-19 21:11:07', '2025-08-19 21:11:07'),
(10, 'Office space', 'office-space', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy.', 200000.00, 200000.00, 'For Sale', 9, 'Bashundhara, Dhaka', 4, 3, 3600, 'sq_ft', 6, 12, 'North', 2, 3, 'available', 1, NULL, 0, 'uploads/properties/68ab2fcebede7_1756049358.jpg', NULL, '2025-08-20 04:37:32', '2025-08-27 01:13:57'),
(14, 'Duplex house', 'duplex-house', 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text.', 850000000.00, NULL, 'For Sale', 8, 'Banani, Dhaka', 8, 5, 3600, 'sq_ft', NULL, 3, 'South', 1, 3, 'available', 1, 3, 1, 'uploads/properties/68ac5930f3f55_1756125489.jpg', NULL, '2025-08-25 12:38:09', '2025-08-25 12:38:09'),
(16, 'Commercial building ', 'commercial-building', 'sjhdsjfhdjghxdfhgbghgryfgcvbbcvbhdfd', 55500000.00, NULL, 'For Sale', 4, 'Motijheel, Dhaka', 4, 4, 3600, 'sq_ft', 2, 13, 'South', 3, 2, 'available', 1, 3, 2, 'uploads/properties/68ae6089927a5_1756258441.jpg', NULL, '2025-08-27 01:34:01', '2025-08-27 01:34:01'),
(17, 'Multi storied building', 'multi-storied-building-1', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.', NULL, 30000.00, 'For Rent', 8, 'Bashundhara, Dhaka', 4, 3, 1800, 'sq_ft', 4, 7, 'West', 2, 3, 'available', 1, 3, 2, 'uploads/properties/68b5e8c08df53_1756752064.jpeg', 2, '2025-09-01 18:41:04', '2025-09-01 19:01:14'),
(18, 'Office space', 'office-space-1', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now ', NULL, 145000.00, 'For Rent', 9, '10/2Mirpur, Dhaka', 5, 2, 3400, 'sq_ft', 6, 7, 'East', 2, 1, 'available', 1, 4, 2, 'uploads/properties/68b70523382b3_1756824867.webp', 1, '2025-09-02 14:54:27', '2025-09-02 14:58:37');

-- --------------------------------------------------------

--
-- Table structure for table `property_amenities`
--

CREATE TABLE `property_amenities` (
  `id` int(11) NOT NULL,
  `property_id` int(11) NOT NULL,
  `amenity_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `property_amenities`
--

INSERT INTO `property_amenities` (`id`, `property_id`, `amenity_id`, `created_at`) VALUES
(17, 17, 13, '2025-09-01 19:01:14'),
(18, 17, 20, '2025-09-01 19:01:14'),
(19, 17, 9, '2025-09-01 19:01:14'),
(20, 17, 6, '2025-09-01 19:01:14'),
(21, 17, 12, '2025-09-01 19:01:14'),
(22, 17, 3, '2025-09-01 19:01:14'),
(23, 17, 4, '2025-09-01 19:01:14'),
(24, 17, 10, '2025-09-01 19:01:14'),
(43, 18, 13, '2025-09-02 14:58:38'),
(44, 18, 12, '2025-09-02 14:58:38'),
(45, 18, 6, '2025-09-02 14:58:38'),
(46, 18, 9, '2025-09-02 14:58:38'),
(47, 18, 3, '2025-09-02 14:58:38'),
(48, 18, 11, '2025-09-02 14:58:38'),
(49, 18, 17, '2025-09-02 14:58:38'),
(50, 18, 4, '2025-09-02 14:58:38'),
(51, 18, 10, '2025-09-02 14:58:38');

-- --------------------------------------------------------

--
-- Table structure for table `property_features`
--

CREATE TABLE `property_features` (
  `id` int(11) NOT NULL,
  `property_id` int(11) NOT NULL,
  `feature_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `property_features`
--

INSERT INTO `property_features` (`id`, `property_id`, `feature_id`, `created_at`) VALUES
(1, 0, 1, '2025-08-17 17:45:43'),
(2, 0, 2, '2025-08-17 17:45:44'),
(3, 0, 3, '2025-08-17 17:45:44'),
(4, 0, 4, '2025-08-17 17:45:44'),
(21, 17, 0, '2025-09-01 19:01:15'),
(22, 17, 0, '2025-09-01 19:01:15'),
(23, 17, 0, '2025-09-01 19:01:15'),
(24, 17, 0, '2025-09-01 19:01:15'),
(25, 17, 0, '2025-09-01 19:01:15'),
(26, 17, 0, '2025-09-01 19:01:15'),
(27, 17, 0, '2025-09-01 19:01:15'),
(28, 17, 0, '2025-09-01 19:01:15'),
(29, 17, 0, '2025-09-01 19:01:15'),
(30, 17, 0, '2025-09-01 19:01:15'),
(31, 17, 0, '2025-09-01 19:01:15'),
(32, 17, 0, '2025-09-01 19:01:15'),
(33, 17, 0, '2025-09-01 19:01:15'),
(34, 17, 0, '2025-09-01 19:01:15');

-- --------------------------------------------------------

--
-- Table structure for table `property_images`
--

CREATE TABLE `property_images` (
  `id` int(11) NOT NULL,
  `property_id` int(11) DEFAULT NULL,
  `image_url` varchar(500) NOT NULL,
  `thumbnail_url` varchar(500) DEFAULT NULL,
  `filename` varchar(255) NOT NULL,
  `file_size` int(11) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `property_types`
--

CREATE TABLE `property_types` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `property_types`
--

INSERT INTO `property_types` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'Apartment', 'Modern apartment units', '2025-08-19 02:05:12'),
(3, 'Villa', 'Luxury villas', '2025-08-19 02:05:12'),
(4, 'Commercial', 'Commercial properties', '2025-08-19 02:05:12'),
(8, 'House', 'luxury house', '2025-08-24 19:18:53'),
(9, 'Office', 'office space', '2025-08-24 19:19:31');

-- --------------------------------------------------------

--
-- Table structure for table `property_views`
--

CREATE TABLE `property_views` (
  `id` int(11) NOT NULL,
  `property_id` int(11) NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `viewed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rent_schedules`
--

CREATE TABLE `rent_schedules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `payment_plan_id` bigint(20) UNSIGNED NOT NULL,
  `appointment_id` bigint(20) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `month` int(2) NOT NULL,
  `year` int(4) NOT NULL,
  `month_year` varchar(20) NOT NULL,
  `rent_amount` decimal(15,2) NOT NULL,
  `due_date` date NOT NULL,
  `paid_date` date DEFAULT NULL,
  `paid_amount` decimal(15,2) DEFAULT 0.00,
  `payment_transaction_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status` enum('pending','paid','overdue','partial','waived') DEFAULT 'pending',
  `late_fee` decimal(10,2) DEFAULT 0.00,
  `utility_paid` tinyint(1) DEFAULT 0,
  `utility_amount` decimal(10,2) DEFAULT 0.00,
  `maintenance_paid` tinyint(1) DEFAULT 0,
  `maintenance_amount` decimal(10,2) DEFAULT 0.00,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `key` varchar(100) NOT NULL,
  `value` text DEFAULT NULL,
  `type` enum('string','number','boolean','json') DEFAULT 'string',
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sslcommerz_transactions`
--

CREATE TABLE `sslcommerz_transactions` (
  `id` int(11) NOT NULL,
  `transaction_id` varchar(255) NOT NULL,
  `payment_plan_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `status` enum('initiated','successful','failed','cancelled') DEFAULT 'initiated',
  `gateway_url` varchar(500) DEFAULT NULL,
  `error_message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','agent','admin') NOT NULL DEFAULT 'customer',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `status` enum('active','inactive','suspended') DEFAULT 'active',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `email_verified_at`, `remember_token`, `status`, `last_login_at`, `created_at`, `updated_at`) VALUES
(1, 'Jhuma', 'jhum@gmail.com', '$2y$10$Jr0ZEncyPWGHPLuw3Al6deSL6qRSJ2TY5yjhQqJ6hMja01o/Q2EIO', 'admin', NULL, NULL, 'active', NULL, '2025-08-17 16:17:28', '2025-08-17 17:00:10'),
(2, 'abc', 'a@gmail.com', '$2y$10$BkO/oIs.NafW7F0R8poCjOxyu0gHadVd4B9nm9/12iiNwUayMDhUq', 'agent', NULL, NULL, 'active', NULL, '2025-08-17 16:18:32', '2025-08-18 04:09:25'),
(3, 'test', 'test@gmail.com', '$2y$10$BEVoXTrvDnybbOAUU8x2rOZKC82np9kd8QuM/BBYuOY3GBF.gjOy2', 'agent', NULL, NULL, 'active', NULL, '2025-08-18 04:04:55', '2025-08-18 04:09:02'),
(4, 'abc', 'abc@gmail.com', '$2y$10$V0pahp5p8TSw1cMR391dUuBE2Y1zpzF3jwFfoCyly05z.yggl0NBe', 'customer', NULL, NULL, 'active', NULL, '2025-08-19 01:26:32', '2025-08-19 01:26:32'),
(5, 'sultana', 'sultana@gmail.com', '$2y$10$Oat8s/IPFmIwr.gGf9a2sODp8KMfS5xlL9EkuTi/d5I8TOmSPVYHG', 'customer', NULL, NULL, 'active', NULL, '2025-08-19 01:32:21', '2025-08-19 01:32:21'),
(6, 'sumi', 'sumi@gmail.com', '$2y$10$VAEQHXvEvl17NVS3oVWIY.zvJ/bU3eB6awUmwW3ClKgvSfuiSnRjW', 'customer', NULL, NULL, 'active', NULL, '2025-08-20 02:24:24', '2025-08-20 02:24:24'),
(7, 'mahmud', 'mahmud@gmail.com', '$2y$10$TrxO8gsyyjak0cWXyp4.7uFj69rXcbZmVhY6fuS2a0I5yrbe5Rda.', 'customer', NULL, NULL, 'active', NULL, '2025-08-24 17:17:34', '2025-08-24 17:17:34'),
(8, 'mahmud', 'mah@gmail.com', '$2y$10$fZJ3mCbhZsozJfbjxgoxIurXUfCsfdVt7QnZz7hNdRMfJLk5fCOBy', 'customer', NULL, NULL, 'active', NULL, '2025-08-24 18:07:33', '2025-08-24 18:07:33'),
(9, 'seema', 'seema@gmail.com', '$2y$10$1CgySM8bfb2VCnZ2vrD0o.3yfV0arM.cojDlJuyt8IndxTMwtusau', 'customer', NULL, NULL, 'active', NULL, '2025-10-06 14:17:53', '2025-10-06 14:17:53');

-- --------------------------------------------------------

--
-- Table structure for table `user_favorites`
--

CREATE TABLE `user_favorites` (
  `id` int(11) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `property_id` int(11) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `amenities`
--
ALTER TABLE `amenities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `billing_information`
--
ALTER TABLE `billing_information`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `installment_schedules`
--
ALTER TABLE `installment_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payment_plan_id` (`payment_plan_id`),
  ADD KEY `appointment_id` (`appointment_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `due_date` (`due_date`),
  ADD KEY `status` (`status`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `billing_id` (`billing_id`),
  ADD KEY `payment_method_id` (`payment_method_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `payment_invoices`
--
ALTER TABLE `payment_invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_invoice_number` (`invoice_number`),
  ADD KEY `payment_plan_id` (`payment_plan_id`),
  ADD KEY `appointment_id` (`appointment_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `invoice_status` (`invoice_status`);

--
-- Indexes for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `payment_plans`
--
ALTER TABLE `payment_plans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appointment_id` (`appointment_id`),
  ADD KEY `property_id` (`property_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `payment_status` (`payment_status`),
  ADD KEY `next_installment_date` (`next_installment_date`),
  ADD KEY `next_rent_due_date` (`next_rent_due_date`);

--
-- Indexes for table `payment_refunds`
--
ALTER TABLE `payment_refunds`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payment_transaction_id` (`payment_transaction_id`),
  ADD KEY `payment_plan_id` (`payment_plan_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `payment_reminders`
--
ALTER TABLE `payment_reminders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payment_plan_id` (`payment_plan_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `reminder_date` (`reminder_date`);

--
-- Indexes for table `payment_transactions`
--
ALTER TABLE `payment_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payment_plan_id` (`payment_plan_id`),
  ADD KEY `appointment_id` (`appointment_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `property_id` (`property_id`),
  ADD KEY `payment_date` (`payment_date`),
  ADD KEY `transaction_type` (`transaction_type`),
  ADD KEY `payment_status` (`payment_status`);

--
-- Indexes for table `properties`
--
ALTER TABLE `properties`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `property_amenities`
--
ALTER TABLE `property_amenities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `property_id` (`property_id`),
  ADD KEY `amenity_id` (`amenity_id`);

--
-- Indexes for table `property_features`
--
ALTER TABLE `property_features`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `property_images`
--
ALTER TABLE `property_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `property_id` (`property_id`),
  ADD KEY `filename` (`filename`);

--
-- Indexes for table `property_types`
--
ALTER TABLE `property_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rent_schedules`
--
ALTER TABLE `rent_schedules`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_month_year` (`payment_plan_id`,`month`,`year`),
  ADD KEY `payment_plan_id` (`payment_plan_id`),
  ADD KEY `appointment_id` (`appointment_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `due_date` (`due_date`),
  ADD KEY `status` (`status`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sslcommerz_transactions`
--
ALTER TABLE `sslcommerz_transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transaction_id` (`transaction_id`),
  ADD KEY `payment_plan_id` (`payment_plan_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `amenities`
--
ALTER TABLE `amenities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `billing_information`
--
ALTER TABLE `billing_information`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `installment_schedules`
--
ALTER TABLE `installment_schedules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_invoices`
--
ALTER TABLE `payment_invoices`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_plans`
--
ALTER TABLE `payment_plans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `payment_refunds`
--
ALTER TABLE `payment_refunds`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_reminders`
--
ALTER TABLE `payment_reminders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_transactions`
--
ALTER TABLE `payment_transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `properties`
--
ALTER TABLE `properties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `property_amenities`
--
ALTER TABLE `property_amenities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `property_features`
--
ALTER TABLE `property_features`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `property_images`
--
ALTER TABLE `property_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `property_types`
--
ALTER TABLE `property_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `rent_schedules`
--
ALTER TABLE `rent_schedules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sslcommerz_transactions`
--
ALTER TABLE `sslcommerz_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `billing_information`
--
ALTER TABLE `billing_information`
  ADD CONSTRAINT `billing_information_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`billing_id`) REFERENCES `billing_information` (`id`),
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD CONSTRAINT `payment_methods_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `property_images`
--
ALTER TABLE `property_images`
  ADD CONSTRAINT `fk_property_images_property_id` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sslcommerz_transactions`
--
ALTER TABLE `sslcommerz_transactions`
  ADD CONSTRAINT `sslcommerz_transactions_ibfk_1` FOREIGN KEY (`payment_plan_id`) REFERENCES `payment_plans` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sslcommerz_transactions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
