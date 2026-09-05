-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 02, 2026 at 07:25 PM
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
-- Database: `grocery_store`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`) VALUES
(1, 'Vegetables', '2026-04-17 04:19:03'),
(2, 'Fruits', '2026-04-17 04:19:03'),
(3, 'Dairy', '2026-04-17 04:19:03'),
(4, 'Bakery', '2026-04-17 04:19:03'),
(5, 'Beverages', '2026-04-17 04:19:03'),
(6, 'Snacks', '2026-04-17 04:19:03'),
(7, 'Meats', '2026-04-21 08:05:37'),
(8, 'Health & Organic', '2026-04-21 08:40:00');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `delivery_address` text NOT NULL,
  `payment_method` varchar(50) DEFAULT 'Cash on Delivery',
  `status` enum('Pending','Confirmed','Processing','Out for Delivery','Delivered','Cancelled') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `delivery_address`, `payment_method`, `status`, `created_at`) VALUES
(1, 2, 180.00, 'Mirpur, Dhaka', 'Cash on Delivery', 'Delivered', '2026-04-17 09:46:41'),
(2, 2, 40.00, 'Mirpur, Dhaka', 'Cash on Delivery', 'Processing', '2026-04-18 11:58:49'),
(3, 2, 305.00, 'Mirpur, Dhaka', 'Cash on Delivery', 'Confirmed', '2026-04-19 11:40:12'),
(4, 2, 180.00, 'Mirpur, Dhaka', 'Cash on Delivery', 'Pending', '2026-04-19 11:56:42'),
(5, 2, 40.00, 'Mirpur, Dhaka', 'Cash on Delivery', 'Cancelled', '2026-04-20 04:34:34'),
(6, 2, 180.00, 'Mirpur, Dhaka', 'Cash on Delivery', 'Out for Delivery', '2026-04-20 09:15:45'),
(7, 2, 470.00, 'Mirpur, Dhaka', 'Cash on Delivery', 'Confirmed', '2026-04-20 10:53:57'),
(8, 2, 220.00, 'Mirpur, Dhaka', 'Cash on Delivery', 'Confirmed', '2026-04-21 11:53:43'),
(9, 2, 610.00, 'Mirpur, Dhaka', 'Cash on Delivery', 'Pending', '2026-04-21 12:50:39'),
(10, 1, 80.00, 'Dhaka, Bangladesh', 'Cash on Delivery', 'Cancelled', '2026-04-22 08:22:35'),
(11, 2, 40.00, 'Mirpur, Dhaka', 'Cash on Delivery', 'Pending', '2026-04-22 08:24:11'),
(12, 2, 390.00, 'Mirpur, Dhaka', 'Cash on Delivery', 'Pending', '2026-04-22 08:29:13'),
(13, 2, 850.00, 'Mirpur, Dhaka', 'Cash on Delivery', 'Processing', '2026-04-22 08:29:32'),
(14, 2, 220.00, 'Mirpur, Dhaka', 'Cash on Delivery', 'Out for Delivery', '2026-04-23 13:25:44');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 20, 1, 180.00),
(2, 2, 19, 1, 40.00),
(3, 3, 20, 1, 180.00),
(4, 3, 19, 1, 40.00),
(5, 3, 18, 1, 85.00),
(6, 4, 20, 1, 180.00),
(7, 5, 19, 1, 40.00),
(8, 6, 20, 1, 180.00),
(9, 7, 4, 1, 45.00),
(10, 7, 20, 2, 180.00),
(11, 7, 19, 1, 40.00),
(12, 7, 17, 1, 25.00),
(13, 8, 21, 1, 220.00),
(14, 9, 21, 1, 220.00),
(15, 9, 24, 1, 390.00),
(18, 12, 24, 1, 390.00),
(19, 13, 22, 1, 850.00),
(20, 14, 5, 1, 55.00),
(21, 14, 16, 1, 110.00),
(22, 14, 14, 1, 55.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `category_id` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `stock` int(11) NOT NULL DEFAULT 0,
  `description` text DEFAULT '',
  `image` varchar(255) DEFAULT 'default.jpg',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `category_id`, `price`, `stock`, `description`, `image`, `created_at`) VALUES
(1, 'Fresh Tomatoes', 1, 30.00, 100, 'Farm fresh red tomatoes picked daily', 'default.jpg', '2026-04-17 04:19:03'),
(2, 'Green Spinach (250g)', 1, 20.00, 80, 'Organic farm fresh spinach', 'default.jpg', '2026-04-17 04:19:03'),
(3, 'Carrot (500g)', 1, 35.00, 70, 'Fresh orange carrots, great for juicing', 'default.jpg', '2026-04-17 04:19:03'),
(4, 'Potato (1kg)', 1, 45.00, 119, 'Fresh potatoes, multipurpose vegetable', 'default.jpg', '2026-04-17 04:19:03'),
(5, 'Onion (1kg)', 1, 55.00, 89, 'Fresh red onions, essential cooking ingredient', 'default.jpg', '2026-04-17 04:19:03'),
(6, 'Banana Bunch', 2, 60.00, 50, 'Fresh ripe bananas, naturally sweet', 'default.jpg', '2026-04-17 04:19:03'),
(7, 'Red Apple (1kg)', 2, 150.00, 40, 'Crispy imported red apples', 'default.jpg', '2026-04-17 04:19:03'),
(8, 'Mango (1kg)', 2, 120.00, 35, 'Sweet Rajshahi mangoes, seasonal special', 'default.jpg', '2026-04-17 04:19:03'),
(9, 'Orange (1kg)', 2, 110.00, 45, 'Juicy fresh oranges, rich in vitamin C', 'default.jpg', '2026-04-17 04:19:03'),
(10, 'Fresh Milk (1L)', 3, 90.00, 60, 'Pure fresh cow milk, delivered daily', 'default.jpg', '2026-04-17 04:19:03'),
(11, 'Cheese Slice (200g)', 3, 120.00, 30, 'Processed cheese slices for sandwiches', 'default.jpg', '2026-04-17 04:19:03'),
(12, 'Yogurt (400g)', 3, 55.00, 45, 'Creamy plain yogurt', 'prod_69e71de61a7997.06003742.jpeg', '2026-04-17 04:19:03'),
(13, 'Butter (200g)', 3, 95.00, 35, 'Fresh unsalted butter', 'default.jpg', '2026-04-17 04:19:03'),
(14, 'Whole Wheat Bread', 4, 55.00, 44, 'Freshly baked whole wheat bread', 'default.jpg', '2026-04-17 04:19:03'),
(15, 'Croissant (4 pcs)', 4, 80.00, 25, 'Buttery flaky croissants, baked fresh', 'default.jpg', '2026-04-17 04:19:03'),
(16, 'Orange Juice (1L)', 5, 110.00, 54, 'Freshly squeezed orange juice, no added sugar', 'default.jpg', '2026-04-17 04:19:03'),
(17, 'Mineral Water (2L)', 5, 25.00, 119, 'Pure mineral water', 'prod_69e71924998614.63243403.jpeg', '2026-04-17 04:19:03'),
(18, 'Green Tea (25 bags)', 5, 85.00, 59, 'Premium green tea bags', 'prod_69e71be433e6b8.20152549.jpeg', '2026-04-17 04:19:03'),
(19, 'Potato Chips (100g)', 6, 40.00, 86, 'Crispy lightly salted flavorful potato chips', 'prod_69e719f8647510.01744592.jpeg', '2026-04-17 04:19:03'),
(20, 'Mixed Nuts (200g)', 6, 180.00, 24, 'Assorted premium roasted nuts', 'prod_69e738f261ea54.41411868.jpeg', '2026-04-17 04:19:03'),
(21, 'Chicken (1kg)', 7, 220.00, 48, 'Fresh whole chicken, cleaned and ready to cook', 'prod_69e7397ec496b2.91489391.jpeg', '2026-04-21 08:05:37'),
(22, 'Beef (1kg)', 7, 850.00, 39, 'Fresh cow\'s beef, tender cuts for cooking', 'prod_69e73b3fe92557.06240149.jpeg', '2026-04-21 08:05:37'),
(23, 'Brown Rice (1kg)', 8, 95.00, 60, 'Whole grain brown rice, rich in fiber and nutrients', 'prod_69e73d8b0d7fa4.22641328.jpeg', '2026-04-21 08:40:00'),
(24, 'Cooking Oil (2l)', 8, 390.00, 18, 'Pure healthy cooking oil, ideal for everyday cooking', 'prod_69e740ad9e8487.33473068.jpeg', '2026-04-21 08:40:00'),
(26, 'Cauliflower (400g)', 1, 40.00, 50, 'Cauliflower, low-calorie cruciferous vegetable rich in fiber and vitamins.', 'prod_69ea2006c4c131.77378519.jpeg', '2026-04-23 13:35:02');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT '',
  `address` text DEFAULT '',
  `role` enum('customer','admin') DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `remember_token` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `address`, `role`, `created_at`, `remember_token`) VALUES
(1, 'Admin', 'admin@freshhut.com', '$2y$10$4dZP63BKDBP0Wf.qCfp/qugssiZ9hPT9Bvfh2V.krr4AHbMt7nQ52', '01700000000', 'Dhaka, Bangladesh', 'admin', '2026-04-17 04:19:02', NULL),
(2, 'Rahim Ahmed', 'customer@test.com', '$2y$10$FQDNQCK.vFlj0qouWh0F8.6Nd0j1yURZ/U2JfVeDI3cDLWtMnEgLC', '01846589711', 'Mirpur, Dhaka', 'customer', '2026-04-17 04:19:03', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_cart` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
