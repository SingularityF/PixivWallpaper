-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 28, 2018 at 05:46 PM
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
-- Database: `singula5_pixiv`
--
CREATE DATABASE IF NOT EXISTS `singula5_pixiv` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `singula5_pixiv`;

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
  `Entropy` float NOT NULL,
  `Format` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DateCreated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Type` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Original/Displayed/Thumbnail',
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

CREATE ALGORITHM=UNDEFINED DEFINER=`singula5`@`localhost` SQL SECURITY DEFINER VIEW `todays_best`  AS  select `images`.`ImageID` AS `ImageID`,`images`.`Image` AS `Image`,`images`.`Width` AS `Width`,`images`.`Height` AS `Height`,`images`.`AspectRatio` AS `AspectRatio`,`images`.`Checksum` AS `Checksum`,`images`.`Entropy` AS `Entropy`,`images`.`Format` AS `Format`,`images`.`DateCreated` AS `DateCreated`,`images`.`Type` AS `Type`,`images`.`IllustID` AS `IllustID`,`images`.`Ranking` AS `Ranking` from `images` where (cast(`images`.`DateCreated` as date) = cast((select max(`images`.`DateCreated`) from `images`) as date)) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`ImageID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `ImageID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
