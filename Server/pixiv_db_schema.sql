-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 30, 2018 at 07:09 PM
-- Server version: 10.1.36-MariaDB-cll-lve
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `PixivWallpaper`
--
CREATE DATABASE IF NOT EXISTS `PixivWallpaper` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `PixivWallpaper`;

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `ImageID` int(10) UNSIGNED NOT NULL,
  `Image` mediumblob NOT NULL,
  `Width` int(10) UNSIGNED NOT NULL,
  `Height` int(10) UNSIGNED NOT NULL,
  `AspectRatio` float NOT NULL,
  `Checksum` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `Entropy` float DEFAULT NULL,
  `AvgGradient` float DEFAULT NULL COMMENT 'Average horizontal gradient in 2 norm',
  `Format` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DateCreated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Type` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Original/Large/Displayed/Thumbnail',
  `IllustID` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=',
  `Ranking` int(11) NOT NULL COMMENT 'Ranking when created'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `images_l`
--

CREATE TABLE `images_l` (
  `ImageID` int(10) UNSIGNED NOT NULL,
  `Image` mediumblob NOT NULL,
  `Width` int(10) UNSIGNED NOT NULL,
  `Height` int(10) UNSIGNED NOT NULL,
  `AspectRatio` float NOT NULL,
  `Checksum` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `Entropy` float DEFAULT NULL,
  `AvgGradient` float DEFAULT NULL COMMENT 'Average horizontal gradient in 2 norm',
  `Format` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DateCreated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Type` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Original/Large/Displayed/Thumbnail',
  `IllustID` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=',
  `Ranking` int(11) NOT NULL COMMENT 'Ranking when created'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `images_t`
--

CREATE TABLE `images_t` (
  `ImageID` int(10) UNSIGNED NOT NULL,
  `Image` mediumblob NOT NULL,
  `Width` int(10) UNSIGNED NOT NULL,
  `Height` int(10) UNSIGNED NOT NULL,
  `AspectRatio` float NOT NULL,
  `Checksum` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `Entropy` float DEFAULT NULL,
  `AvgGradient` float DEFAULT NULL COMMENT 'Average horizontal gradient in 2 norm',
  `Format` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DateCreated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Type` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Original/Large/Displayed/Thumbnail',
  `IllustID` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=',
  `Ranking` int(11) NOT NULL COMMENT 'Ranking when created'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `todays_best`
-- (See below for the actual view)
--
CREATE TABLE `todays_best` (
`ImageID` int(10) unsigned
,`Image` mediumblob
,`Width` int(10) unsigned
,`Height` int(10) unsigned
,`AspectRatio` float
,`Checksum` char(32)
,`Entropy` float
,`AvgGradient` float
,`Format` varchar(32)
,`DateCreated` datetime
,`Type` varchar(32)
,`IllustID` varchar(32)
,`Ranking` int(11)
);

-- --------------------------------------------------------

--
-- Structure for view `todays_best`
--
DROP TABLE IF EXISTS `todays_best`;

CREATE ALGORITHM=UNDEFINED DEFINER=`singula5`@`localhost` SQL SECURITY DEFINER VIEW `todays_best`  AS  select `images_t`.`ImageID` AS `ImageID`,`images_t`.`Image` AS `Image`,`images_t`.`Width` AS `Width`,`images_t`.`Height` AS `Height`,`images_t`.`AspectRatio` AS `AspectRatio`,`images_t`.`Checksum` AS `Checksum`,`images_t`.`Entropy` AS `Entropy`,`images_t`.`AvgGradient` AS `AvgGradient`,`images_t`.`Format` AS `Format`,`images_t`.`DateCreated` AS `DateCreated`,`images_t`.`Type` AS `Type`,`images_t`.`IllustID` AS `IllustID`,`images_t`.`Ranking` AS `Ranking` from `images_t` where (cast(`images_t`.`DateCreated` as date) = cast((select max(`images_t`.`DateCreated`) from `images_t`) as date)) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`ImageID`),
  ADD UNIQUE KEY `IllustID` (`IllustID`);

--
-- Indexes for table `images_l`
--
ALTER TABLE `images_l`
  ADD PRIMARY KEY (`ImageID`),
  ADD UNIQUE KEY `IllustID` (`IllustID`);

--
-- Indexes for table `images_t`
--
ALTER TABLE `images_t`
  ADD PRIMARY KEY (`ImageID`),
  ADD UNIQUE KEY `IllustID` (`IllustID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `ImageID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=774;

--
-- AUTO_INCREMENT for table `images_l`
--
ALTER TABLE `images_l`
  MODIFY `ImageID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `images_t`
--
ALTER TABLE `images_t`
  MODIFY `ImageID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
