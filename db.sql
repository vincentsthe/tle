-- phpMyAdmin SQL Dump
-- version 4.4.9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 13, 2016 at 07:02 PM
-- Server version: 5.6.25-log
-- PHP Version: 5.5.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tle`
--

-- --------------------------------------------------------

--
-- Table structure for table `grading`
--

CREATE TABLE IF NOT EXISTS `grading` (
  `id` int(11) NOT NULL,
  `submission_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `problem_id` int(11) NOT NULL,
  `score` int(11) DEFAULT NULL,
  `verdict_code` varchar(64) DEFAULT NULL,
  `verdict_name` varchar(64) DEFAULT NULL,
  `evaluated` tinyint(4) DEFAULT '0',
  `submission_time` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `last_id`
--

CREATE TABLE IF NOT EXISTS `last_id` (
  `id` int(11) NOT NULL,
  `field` varchar(255) NOT NULL,
  `value` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `problem`
--

CREATE TABLE IF NOT EXISTS `problem` (
  `id` int(11) NOT NULL,
  `problem_jid` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `create_time` int(11) NOT NULL,
  `accepted_user` int(11) NOT NULL,
  `total_submission` int(11) NOT NULL,
  `accepted_submission` int(11) NOT NULL,
  `url` varchar(512) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `submission`
--

CREATE TABLE IF NOT EXISTS `submission` (
  `id` int(11) NOT NULL,
  `submission_jid` varchar(255) NOT NULL,
  `verdict_code` varchar(64) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `submit_time` int(11) NOT NULL,
  `language` varchar(64) NOT NULL,
  `problem_id` int(11) NOT NULL,
  `verdict_name` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL,
  `user_jid` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `accepted_submission` int(11) NOT NULL,
  `total_submission` int(11) NOT NULL,
  `accepted_problem` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user_accepted_submission`
--

CREATE TABLE IF NOT EXISTS `user_accepted_submission` (
  `problem_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `time` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `verdict`
--

CREATE TABLE IF NOT EXISTS `verdict` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `alias` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `grading`
--
ALTER TABLE `grading`
  ADD PRIMARY KEY (`id`),
  ADD KEY `evaluated` (`evaluated`);

--
-- Indexes for table `last_id`
--
ALTER TABLE `last_id`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `problem`
--
ALTER TABLE `problem`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `problem_jid_2` (`problem_jid`),
  ADD KEY `problem_jid` (`problem_jid`);

--
-- Indexes for table `submission`
--
ALTER TABLE `submission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `submission_jid` (`submission_jid`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_jid` (`user_jid`);

--
-- Indexes for table `user_accepted_submission`
--
ALTER TABLE `user_accepted_submission`
  ADD PRIMARY KEY (`problem_id`,`user_id`);

--
-- Indexes for table `verdict`
--
ALTER TABLE `verdict`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `last_id`
--
ALTER TABLE `last_id`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `verdict`
--
ALTER TABLE `verdict`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
