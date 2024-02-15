-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 14, 2024 at 09:05 PM
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
-- Database: `syn_billing`
--

-- --------------------------------------------------------

--
-- Table structure for table `md_branch`
--

CREATE TABLE `md_branch` (
  `id` int(11) NOT NULL,
  `comp_id` int(11) NOT NULL COMMENT 'md_company->id',
  `branch_name` varchar(100) NOT NULL,
  `branch_address` varchar(100) DEFAULT NULL,
  `location` int(11) NOT NULL,
  `contact_person` varchar(50) DEFAULT NULL,
  `phone_no` bigint(20) DEFAULT NULL,
  `email_id` varchar(100) NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_dt` datetime DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  `modified_dt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `md_branch`
--

INSERT INTO `md_branch` (`id`, `comp_id`, `branch_name`, `branch_address`, `location`, `contact_person`, `phone_no`, `email_id`, `created_by`, `created_dt`, `modified_by`, `modified_dt`) VALUES
(1, 1, 'BARAHAT', 'Bharat,Bihar', 0, 'BARAHAT', 7369000516, 'barahat@gmail.com', 'admin', '2024-01-31 17:53:22', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `md_company`
--

CREATE TABLE `md_company` (
  `id` int(11) NOT NULL,
  `company_name` varchar(100) NOT NULL,
  `address` text DEFAULT NULL,
  `location` int(11) NOT NULL,
  `contact_person` varchar(50) DEFAULT NULL,
  `phone_no` bigint(20) DEFAULT NULL,
  `email_id` varchar(50) NOT NULL,
  `logo` varchar(100) NOT NULL,
  `web_portal` enum('Y','N') NOT NULL DEFAULT 'N',
  `active_flag` enum('Y','N') NOT NULL DEFAULT 'Y',
  `created_by` varchar(50) DEFAULT NULL,
  `created_dt` datetime DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  `modified_dt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `md_company`
--

INSERT INTO `md_company` (`id`, `company_name`, `address`, `location`, `contact_person`, `phone_no`, `email_id`, `logo`, `web_portal`, `active_flag`, `created_by`, `created_dt`, `modified_by`, `modified_dt`) VALUES
(1, 'OM TRADERS', 'Ashirwad Bhawan, G. C. Banarjee Road, Bhikhanpur,Bhagalpur, Bihar- 812001', 0, 'Abhijeet', 7008893051, 'purdcsltd@gmail.com', '', 'N', 'Y', 'admin', '2024-01-31 17:50:48', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `md_container`
--

CREATE TABLE `md_container` (
  `sl_no` int(11) NOT NULL,
  `container_type` varchar(100) NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `md_header_footer`
--

CREATE TABLE `md_header_footer` (
  `comp_id` int(11) NOT NULL,
  `header1` varchar(30) DEFAULT NULL,
  `on_off_flag1` enum('Y','N') NOT NULL DEFAULT 'N',
  `header2` varchar(30) DEFAULT NULL,
  `on_off_flag2` enum('Y','N') NOT NULL DEFAULT 'N',
  `footer1` varchar(30) NOT NULL DEFAULT 'N',
  `on_off_flag3` enum('Y','N') NOT NULL DEFAULT 'N',
  `footer2` varchar(30) DEFAULT NULL,
  `on_off_flag4` enum('Y','N') NOT NULL DEFAULT 'N',
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `md_header_footer`
--

INSERT INTO `md_header_footer` (`comp_id`, `header1`, `on_off_flag1`, `header2`, `on_off_flag2`, `footer1`, `on_off_flag3`, `footer2`, `on_off_flag4`, `created_by`, `created_at`, `modified_by`, `modified_at`) VALUES
(1, 'ॐ गणेशाय नमः', 'Y', 'Your purchase bill', 'Y', 'Thank You,Visit Again', 'Y', 'Have a nice day', 'Y', 'admin', '2024-02-02 12:05:32', 'admin', '2024-02-02 12:05:41');

-- --------------------------------------------------------

--
-- Table structure for table `md_items`
--

CREATE TABLE `md_items` (
  `id` bigint(20) NOT NULL,
  `com_id` int(11) NOT NULL,
  `hsn_code` varchar(20) DEFAULT NULL,
  `item_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `unit_id` int(11) NOT NULL,
  `container_id` int(11) NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_dt` datetime DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  `modified_dt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `md_items`
--

INSERT INTO `md_items` (`id`, `com_id`, `hsn_code`, `item_name`, `description`, `unit_id`, `container_id`, `created_by`, `created_dt`, `modified_by`, `modified_dt`) VALUES
(1, 1, '18061000', 'Emami Rice Bran Oil', 'aa', 0, 0, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(2, 1, '08041020', 'Lux Soap', 'aa', 0, 0, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(3, 1, '18061000', 'Tata Mung Daal 500gm', 'aa', 0, 0, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(4, 1, '18061000', 'Coca Cola 1Ltr', 'aa', 0, 0, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(5, 1, '18061000', 'Cadbury Dairy Milk', 'aa', 0, 0, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(6, 1, '18061001', 'Fortune Soya Chunks', 'aa', 0, 0, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(7, 1, '8041021', 'Amul Chocolate Dark', 'aa', 0, 0, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(8, 1, '18061000', 'Amul Chocolate Milk', 'aa', 0, 0, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(9, 1, '18061000', 'Cadbury Dairy Milk Gold', 'aa', 0, 0, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(10, 1, '18061000', 'Sprite 700ml', 'aa', 0, 0, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(11, 1, '18061002', 'Amul Chocolate Peanut', 'aa', 0, 0, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(12, 1, '8041022', 'Amul Milk', 'aa', 0, 0, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(13, 1, '18061000', 'Modern Bread', 'aa', 0, 0, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(14, 1, '18061000', 'Britania Thin', 'aa', 0, 0, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(15, 1, '18061000', 'Gooday biscuits', 'aa', 0, 0, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(16, 1, '18061003', 'Bapuji Cakes', 'aa', 0, 0, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00');

-- --------------------------------------------------------

--
-- Table structure for table `md_item_rate`
--

CREATE TABLE `md_item_rate` (
  `id` bigint(20) NOT NULL,
  `item_id` bigint(20) NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cgst` decimal(10,2) NOT NULL DEFAULT 0.00,
  `sgst` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_by` varchar(50) DEFAULT NULL,
  `created_dt` datetime DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  `modified_dt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `md_item_rate`
--

INSERT INTO `md_item_rate` (`id`, `item_id`, `price`, `discount`, `cgst`, `sgst`, `created_by`, `created_dt`, `modified_by`, `modified_dt`) VALUES
(1, 1, 100.00, 0.00, 5.00, 5.00, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(2, 2, 10.85, 0.00, 5.00, 5.00, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(3, 3, 89.00, 5.00, 5.00, 5.00, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(4, 4, 55.74, 2.00, 5.00, 5.00, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(5, 5, 20.00, 0.00, 5.00, 5.00, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(6, 6, 98.54, 1.00, 12.00, 12.00, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(7, 7, 10.00, 0.00, 12.00, 12.00, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(8, 8, 22.00, 0.00, 12.00, 12.00, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(9, 9, 45.46, 0.00, 12.00, 12.00, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(10, 10, 30.00, 0.00, 5.00, 5.00, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(11, 11, 50.00, 0.25, 5.00, 5.00, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(12, 12, 29.00, 0.00, 5.00, 5.00, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(13, 13, 48.71, 0.50, 5.00, 5.00, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(14, 14, 52.00, 0.00, 28.00, 28.00, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(15, 15, 5.00, 0.00, 18.00, 18.00, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00'),
(16, 16, 10.00, 0.00, 12.00, 12.00, 'admin', '2024-01-31 17:54:00', 'admin', '2024-01-31 17:54:00');

-- --------------------------------------------------------

--
-- Table structure for table `md_location`
--

CREATE TABLE `md_location` (
  `sl_no` int(11) NOT NULL,
  `location_name` varchar(200) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `md_location`
--

INSERT INTO `md_location` (`sl_no`, `location_name`, `created_by`, `created_at`, `modified_by`, `modified_at`) VALUES
(1, 'Bhubhaneshwar', NULL, NULL, NULL, NULL),
(2, 'Puri', NULL, NULL, NULL, NULL),
(3, 'Cuttack', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `md_receipt_settings`
--

CREATE TABLE `md_receipt_settings` (
  `comp_id` int(11) NOT NULL,
  `rcpt_type` enum('P','S','B') NOT NULL COMMENT 'P->Print,S->SMS,B->Both',
  `gst_flag` enum('Y','N') NOT NULL DEFAULT 'N',
  `cust_inf` enum('Y','N') NOT NULL DEFAULT 'N',
  `pay_mode` enum('Y','N') NOT NULL DEFAULT 'N',
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `md_receipt_settings`
--

INSERT INTO `md_receipt_settings` (`comp_id`, `rcpt_type`, `gst_flag`, `cust_inf`, `pay_mode`, `created_by`, `created_at`, `modified_by`, `modified_at`) VALUES
(1, 'B', 'Y', 'N', 'Y', 'admin', '2024-02-02 11:54:52', 'admin', '2024-02-02 11:54:58');

-- --------------------------------------------------------

--
-- Table structure for table `md_unit`
--

CREATE TABLE `md_unit` (
  `sl_no` int(11) NOT NULL DEFAULT 0,
  `unit_name` varchar(50) NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `md_user`
--

CREATE TABLE `md_user` (
  `id` int(11) NOT NULL,
  `comp_id` int(11) NOT NULL COMMENT 'md_company -> id',
  `br_id` int(11) NOT NULL COMMENT 'md_branch -> id',
  `user_name` varchar(100) NOT NULL,
  `user_type` enum('A','U') NOT NULL DEFAULT 'U' COMMENT 'A-> Admin, U-> User',
  `user_id` varchar(100) NOT NULL,
  `phone_no` bigint(20) NOT NULL,
  `email_id` varchar(100) NOT NULL,
  `device_id` varchar(50) NOT NULL,
  `password` varchar(150) NOT NULL,
  `active_flag` enum('Y','N') NOT NULL DEFAULT 'Y',
  `created_by` varchar(50) DEFAULT NULL,
  `created_dt` datetime DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  `modified_dt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `md_user`
--

INSERT INTO `md_user` (`id`, `comp_id`, `br_id`, `user_name`, `user_type`, `user_id`, `phone_no`, `email_id`, `device_id`, `password`, `active_flag`, `created_by`, `created_dt`, `modified_by`, `modified_dt`) VALUES
(1, 1, 1, 'Sayantika', 'U', '6295825458', 6295825458, 'san@mail.com', '954', '$2b$12$VzgPCjRhrXWg.CL7l5EcquP54EVc3zy89d7WtZ8Iq/TZKPlitR.HG', 'Y', 'Sayantika', '2024-02-01 10:56:34', NULL, NULL),
(5, 1, 1, 'Subham', 'U', '8910792003', 8910792003, 'san1@mail.com', '9540', '$2b$12$i0pr.0rWVfjWAWkGtTDsFuu1Hd4BcqpkNGlKOAOERS.wUD1xb037O', 'Y', 'Subham', '2024-02-01 10:56:34', NULL, NULL),
(6, 1, 0, 'Tanmoy', 'A', '9831887194', 9831887194, 'mondal.tanmoy@synergicsoftek.com', '0', '$2b$10$RDWFuOpLL/F7NzSIvOSZIuRxOgCd/xKNWKxOEqf7fdPivxnpwpMv2', 'Y', 'tanmoy', '2024-02-01 10:56:34', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `td_item_purchase`
--

CREATE TABLE `td_item_purchase` (
  `id` bigint(20) NOT NULL,
  `comp_id` int(11) NOT NULL,
  `br_id` int(11) NOT NULL,
  `receipt_no` int(11) NOT NULL,
  `item_id` bigint(20) NOT NULL,
  `tnx_date` date NOT NULL,
  `price` float(10,2) NOT NULL DEFAULT 0.00,
  `qty` int(11) NOT NULL DEFAULT 0,
  `created_by` varchar(50) DEFAULT NULL,
  `created_dt` datetime DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  `modified_dt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `td_item_sale`
--

CREATE TABLE `td_item_sale` (
  `receipt_no` bigint(20) NOT NULL,
  `comp_id` int(11) NOT NULL,
  `br_id` int(11) NOT NULL,
  `item_id` bigint(20) NOT NULL,
  `trn_date` date NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cgst_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `sgst_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `qty` int(11) NOT NULL DEFAULT 0,
  `created_by` varchar(50) DEFAULT NULL,
  `created_dt` datetime DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  `modified_dt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `td_item_sale`
--

INSERT INTO `td_item_sale` (`receipt_no`, `comp_id`, `br_id`, `item_id`, `trn_date`, `price`, `discount_amt`, `cgst_amt`, `sgst_amt`, `qty`, `created_by`, `created_dt`, `modified_by`, `modified_dt`) VALUES
(1005874526987, 1, 1, 1, '2024-02-05', 300.00, 75.00, 45.00, 45.00, 3, 'Sayantika', '2024-02-05 10:50:07', NULL, NULL),
(1005874526987, 1, 1, 11, '2024-02-05', 100.00, 0.50, 5.00, 5.00, 2, 'Sayantika', '2024-02-05 10:52:14', NULL, NULL),
(1005874526988, 1, 1, 11, '2024-02-05', 100.00, 0.50, 5.00, 5.00, 2, 'Sayantika', '2024-02-05 10:52:14', NULL, NULL),
(1005874526989, 1, 1, 11, '2024-02-06', 100.00, 0.50, 5.00, 5.00, 2, 'Subham', '2024-02-05 10:52:14', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `td_receipt`
--

CREATE TABLE `td_receipt` (
  `receipt_no` bigint(20) NOT NULL,
  `trn_date` date NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cgst_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `sgst_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `round_off` decimal(10,2) NOT NULL DEFAULT 0.00,
  `net_amt` decimal(10,2) DEFAULT 0.00,
  `pay_mode` enum('C','U','D','') NOT NULL COMMENT 'C->Cash,U->UPI,D->Card',
  `received_amt` decimal(10,2) NOT NULL DEFAULT 0.00,
  `pay_dtls` text DEFAULT NULL,
  `cust_name` varchar(100) DEFAULT NULL,
  `phone_no` varchar(50) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_dt` datetime DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  `modified_dt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `td_receipt`
--

INSERT INTO `td_receipt` (`receipt_no`, `trn_date`, `price`, `discount_amt`, `cgst_amt`, `sgst_amt`, `amount`, `round_off`, `net_amt`, `pay_mode`, `received_amt`, `pay_dtls`, `cust_name`, `phone_no`, `created_by`, `created_dt`, `modified_by`, `modified_dt`) VALUES
(1005874526987, '2024-02-05', 400.00, 75.50, 50.00, 50.00, 576.00, 0.50, 600.00, 'C', 600.00, 'In cash', 'Rupsha', '7894561230', 'Sayantika', '2024-02-05 10:47:20', NULL, NULL),
(1005874526988, '2024-02-05', 400.00, 75.50, 50.00, 50.00, 576.00, 0.50, 600.00, 'U', 600.00, 'In cash', 'Poulomi', '1234567893', 'Sayantika', '2024-02-05 10:47:20', NULL, NULL),
(1005874526989, '2024-02-06', 400.00, 75.50, 50.00, 50.00, 576.00, 0.50, 800.00, 'C', 600.00, 'In cash', 'Amit', '4561237895', 'Subham', '2024-02-05 10:47:20', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `md_branch`
--
ALTER TABLE `md_branch`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `md_company`
--
ALTER TABLE `md_company`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `md_container`
--
ALTER TABLE `md_container`
  ADD PRIMARY KEY (`sl_no`);

--
-- Indexes for table `md_header_footer`
--
ALTER TABLE `md_header_footer`
  ADD PRIMARY KEY (`comp_id`);

--
-- Indexes for table `md_items`
--
ALTER TABLE `md_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `md_item_rate`
--
ALTER TABLE `md_item_rate`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `md_location`
--
ALTER TABLE `md_location`
  ADD PRIMARY KEY (`sl_no`);

--
-- Indexes for table `md_receipt_settings`
--
ALTER TABLE `md_receipt_settings`
  ADD PRIMARY KEY (`comp_id`);

--
-- Indexes for table `md_user`
--
ALTER TABLE `md_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `td_item_purchase`
--
ALTER TABLE `td_item_purchase`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `td_item_sale`
--
ALTER TABLE `td_item_sale`
  ADD PRIMARY KEY (`receipt_no`,`item_id`);

--
-- Indexes for table `td_receipt`
--
ALTER TABLE `td_receipt`
  ADD PRIMARY KEY (`receipt_no`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `md_branch`
--
ALTER TABLE `md_branch`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `md_company`
--
ALTER TABLE `md_company`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `md_container`
--
ALTER TABLE `md_container`
  MODIFY `sl_no` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `md_items`
--
ALTER TABLE `md_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `md_item_rate`
--
ALTER TABLE `md_item_rate`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `md_location`
--
ALTER TABLE `md_location`
  MODIFY `sl_no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `md_user`
--
ALTER TABLE `md_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `td_item_purchase`
--
ALTER TABLE `td_item_purchase`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
