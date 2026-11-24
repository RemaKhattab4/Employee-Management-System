-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 24 نوفمبر 2026 الساعة 17:52
-- إصدار الخادم: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nexora_db`
--

-- --------------------------------------------------------

--
-- بنية الجدول `com/nexora/employee/attendance`
--

CREATE TABLE `com/nexora/employee/attendance` (
  `id` bigint(20) NOT NULL,
  `attendance_date` date DEFAULT NULL,
  `check_in` time DEFAULT NULL,
  `check_out` time DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `employee_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `com/nexora/employee/attendance`
--

INSERT INTO `com/nexora/employee/attendance` (`id`, `attendance_date`, `check_in`, `check_out`, `status`, `employee_id`) VALUES
(2, '2026-11-19', '08:00:00', '16:15:00', 'Present', 4),
(4, '2026-11-19', '08:30:00', '16:31:00', 'Present', 2),
(5, '2026-11-19', NULL, NULL, 'Absent', 5),
(6, '2026-11-19', '09:15:00', '16:34:00', 'Late', 6),
(8, '2026-11-19', '08:10:00', '16:40:00', 'Present', 7),
(9, '2026-11-19', NULL, NULL, 'Absent', 8),
(10, '2026-11-19', '08:00:00', '16:00:00', 'Present', 9),
(12, '2026-11-19', '08:04:00', '16:04:00', 'Present', 11),
(13, '2026-11-19', NULL, NULL, 'Absent', 12),
(14, '2026-11-19', '12:04:00', '16:05:00', 'Half Day', 10),
(15, '2026-11-19', '08:05:00', '16:05:00', 'Present', 13),
(16, '2026-11-22', '08:12:00', '15:12:00', 'Present', 16);

-- --------------------------------------------------------

--
-- بنية الجدول `departments`
--

CREATE TABLE `departments` (
  `id` bigint(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `departments`
--

INSERT INTO `departments` (`id`, `description`, `name`) VALUES
(1, 'Information Technology', 'IT'),
(2, 'Human Resources Department', 'Human Resources'),
(3, 'Financial Management', 'Finance'),
(4, 'Marketing Department', 'Marketing'),
(5, 'Sales Department', 'Sales');

-- --------------------------------------------------------

--
-- بنية الجدول `employees`
--

CREATE TABLE `employees` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `job_title` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `salary` decimal(38,2) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `department_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `employees`
--

INSERT INTO `employees` (`id`, `email`, `first_name`, `gender`, `hire_date`, `job_title`, `last_name`, `phone`, `salary`, `status`, `department_id`) VALUES
(2, 'eyadkhattab91@gmail.com', 'Eyad', 'Male', '2002-05-02', 'web developer', 'Khattab', '0780819191', 600.00, 'Active', 1),
(4, 'sara@gmail.com', 'Sarah', 'Female', '2026-11-07', 'Software Developer', 'Johnson', '078000000', 850.00, 'Active', 1),
(5, 'michael@gmail.com', 'Michael', 'Male', '2026-11-04', 'System Administrator', 'Brown', '078000000', 750.00, 'Active', 1),
(6, 'emily@gmail.com', 'Emily', 'Female', '2026-08-14', 'HR Manager', 'Davis', '078000000', 800.00, 'Active', 2),
(7, 'Wilson@gmail.com', 'James', 'Male', '2026-10-17', 'HR Assistant', 'Wilson', '078000000', 500.00, 'Active', 2),
(8, 'Martin@gmail.com', 'Olivia', 'Female', '2026-08-03', 'Accountant', 'Martin', '078000000', 650.00, 'Active', 3),
(9, 'DanielTaylor@gmail.com', 'Daniel', 'Male', '2026-08-30', 'Financial Analyst', 'Taylor', '0780819191', 900.00, 'Active', 3),
(10, 'SophiaAnderson@gmail.com', 'Sophia', 'Female', '2026-10-03', 'Marketing Specialist', 'Anderson', '078000000', 700.00, 'Active', 4),
(11, 'WilliamThomas@gmail.com', 'William', 'Male', '2026-09-05', 'Social Media Manager', 'Thomas', '0000000', 600.00, 'Active', 4),
(12, 'AvaRobinson@gmail.com', 'Ava', 'Female', '2026-05-08', 'Sales Manager', 'Robinson', '078000000', 850.00, 'Active', 5),
(13, 'EthanClark@gmail.com', 'Ethan', 'Male', '2026-11-01', 'Sales Representative', 'Clark', '078000000', 550.00, 'Active', 5),
(16, 'remakhattab5@gmail.com', 'Rema', 'Female', '2026-11-07', 'web developer', 'Khattab', '0780819191', 600.00, 'Active', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `com/nexora/employee/attendance`
--
ALTER TABLE `com/nexora/employee/attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKq8hw3y3m5xsf9x90qx5d7eewv` (`employee_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKj6cwks7xecs5jov19ro8ge3qk` (`name`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKj9xgmd0ya5jmus09o0b8pqrpb` (`email`),
  ADD KEY `FKgy4qe3dnqrm3ktd76sxp7n4c2` (`department_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `com/nexora/employee/attendance`
--
ALTER TABLE `com/nexora/employee/attendance`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- قيود الجداول المُلقاة.
--

--
-- قيود الجداول `com/nexora/employee/attendance`
--
ALTER TABLE `com/nexora/employee/attendance`
  ADD CONSTRAINT `FKq8hw3y3m5xsf9x90qx5d7eewv` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

--
-- قيود الجداول `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `FKgy4qe3dnqrm3ktd76sxp7n4c2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
