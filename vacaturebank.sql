-- phpMyAdmin SQL Dump
-- version 4.4.10
-- http://www.phpmyadmin.net
--
-- Host: localhost:8889
-- Generation Time: May 26, 2016 at 02:57 PM
-- Server version: 5.5.42
-- PHP Version: 5.6.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vacaturebank`
--

-- --------------------------------------------------------

--
-- Table structure for table `bedrijf`
--

CREATE TABLE `bedrijf` (
  `bedrijfID` int(10) NOT NULL,
  `userID` int(10) NOT NULL,
  `bedrijfNaam` varchar(20) NOT NULL,
  `postcode` varchar(6) NOT NULL,
  `plaats` varchar(20) NOT NULL,
  `telefoon` varchar(14) NOT NULL,
  `adres` varchar(15) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bedrijf`
--

INSERT INTO `bedrijf` (`bedrijfID`, `userID`, `bedrijfNaam`, `postcode`, `plaats`, `telefoon`, `adres`) VALUES
(3, 35, 'Vodafone', '66F', 'Amsterdam', '06387318713', 'Insulindeweg'),
(8, 49, 'ROC', '1101 D', 'Bijlmer', '0624224242', 'Arena Boulevard'),
(9, 52, '1', '1', '1', '1', '1');

-- --------------------------------------------------------

--
-- Table structure for table `functies`
--

CREATE TABLE `functies` (
  `functieID` int(10) NOT NULL,
  `functienaam` varchar(20) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `functies`
--

INSERT INTO `functies` (`functieID`, `functienaam`) VALUES
(1, 'Frontend'),
(2, 'Backend'),
(3, 'App developer');

-- --------------------------------------------------------

--
-- Table structure for table `sollicitant`
--

CREATE TABLE `sollicitant` (
  `sollicitantID` int(10) NOT NULL,
  `userID` int(10) NOT NULL,
  `Voornaam` varchar(10) NOT NULL,
  `achternaam` varchar(10) NOT NULL,
  `adres` varchar(20) NOT NULL,
  `postcode` varchar(6) NOT NULL,
  `plaats` varchar(30) NOT NULL,
  `telefoon` int(10) NOT NULL,
  `geslacht` varchar(10) NOT NULL,
  `beschrijving` varchar(250) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sollicitant`
--

INSERT INTO `sollicitant` (`sollicitantID`, `userID`, `Voornaam`, `achternaam`, `adres`, `postcode`, `plaats`, `telefoon`, `geslacht`, `beschrijving`) VALUES
(6, 31, 'Abdalla', 'Elmedny', 'Insulindeweg 66f', '1094PN', 'Amsterdam', 624242423, 'man', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, rerum dicta nemo provident totam quod quo libero quos quae tenetur. Aliquam consequatur, quod nihil ex voluptates quia, rerum laborum numquam.'),
(10, 37, 'Nathan', 'Bommezijn', ' Reguliersbreestraat', '1017 C', 'Amsterdam', 624464474, 'man', 'Mekongdal lot hoofdzaak bepaalden der sap evenwicht schatkist bij. Na wantrouwen beschikken op uiteenvalt de. Te grooter nu ketting er opnieuw gronden percent. Dik drijven voordat lot dan zooveel zee bewogen deficit. Insnijding herkenbaar een dividen'),
(11, 38, 'Samy', 'Iets', 'Nieuwendijk 14', '1012 M', 'Amsterdam', 2147483647, 'man', 'Hey, ik ben samy. doei.'),
(12, 51, 'Sanchezzzz', 'Sanchez', 'roc', '1094PN', 'amsterdam', 6, 'man', 'Ik ben meneer sanchez');

-- --------------------------------------------------------

--
-- Table structure for table `sollicitatie`
--

CREATE TABLE `sollicitatie` (
  `sollicitatieID` int(10) NOT NULL,
  `sollicitantID` int(10) NOT NULL,
  `vacatureID` int(10) NOT NULL,
  `datum` int(64) NOT NULL,
  `status` varchar(10) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sollicitatie`
--

INSERT INTO `sollicitatie` (`sollicitatieID`, `sollicitantID`, `vacatureID`, `datum`, `status`) VALUES
(3, 6, 17, 1461286636, 'denied'),
(4, 6, 22, 1461286951, 'denied'),
(5, 10, 22, 1461286992, 'denied'),
(27, 12, 22, 1464193289, 'denied'),
(28, 10, 40, 1464197543, 'pending'),
(29, 10, 39, 1464197566, 'denied');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` int(10) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(256) NOT NULL,
  `userType` varchar(15) NOT NULL,
  `profielFoto` varchar(256) NOT NULL,
  `date` int(64) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `email`, `password`, `userType`, `profielFoto`, `date`) VALUES
(31, 'appie@gmail.com', 'ef67d6ff33ab21c877cb5b694f3f932f719ddd166c3e48d2ac0753545c177ce0', 'sollicitant', 'images/me.png', 1464163861),
(35, 'company@gmail.com', 'ef67d6ff33ab21c877cb5b694f3f932f719ddd166c3e48d2ac0753545c177ce0', 'bedrijf', 'images/company.png', 1461248668),
(37, 'applicant@gmail.com', 'ef67d6ff33ab21c877cb5b694f3f932f719ddd166c3e48d2ac0753545c177ce0', 'sollicitant', 'https://yt3.ggpht.com/-rD9mQGwG75Y/AAAAAAAAAAI/AAAAAAAAAAA/kNDVM_zsRDo/s900-c-k-no/photo.jpg', 1461283691),
(38, 'samy@gmail.com', 'ef67d6ff33ab21c877cb5b694f3f932f719ddd166c3e48d2ac0753545c177ce0', 'sollicitant', 'images/defaultpf.png', 1461311168),
(39, 'admin@gmail.nl', 'ef67d6ff33ab21c877cb5b694f3f932f719ddd166c3e48d2ac0753545c177ce0', 'admin', 'images/me.png', 0),
(49, 'samy@roc.nl', 'ef67d6ff33ab21c877cb5b694f3f932f719ddd166c3e48d2ac0753545c177ce0', 'bedrijf', 'images/company.png', 1461311444),
(51, 'sanchez@roc.nl', 'ef67d6ff33ab21c877cb5b694f3f932f719ddd166c3e48d2ac0753545c177ce0', 'sollicitant', 'images/defaultpf.png', 1464163429),
(52, 'abdallaroc@gmail.com', 'ef67d6ff33ab21c877cb5b694f3f932f719ddd166c3e48d2ac0753545c177ce0', 'bedrijf', 'images/company.png', 1464163861),
(53, 'samy@hotmail.com', 'ef67d6ff33ab21c877cb5b694f3f932f719ddd166c3e48d2ac0753545c177ce0', 'admin', '', 1464266308);

-- --------------------------------------------------------

--
-- Table structure for table `vacatures`
--

CREATE TABLE `vacatures` (
  `vacatureID` int(10) NOT NULL,
  `bedrijfID` int(10) NOT NULL,
  `functieID` int(10) NOT NULL,
  `beschrijving` varchar(1000) NOT NULL,
  `titel` varchar(35) NOT NULL,
  `eisen` varchar(500) NOT NULL,
  `commisie` int(10) NOT NULL,
  `salaris` int(10) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `vacatures`
--

INSERT INTO `vacatures` (`vacatureID`, `bedrijfID`, `functieID`, `beschrijving`, `titel`, `eisen`, `commisie`, `salaris`) VALUES
(22, 3, 2, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt deleniti magnam sunt alias labore iusto? Deleniti deserunt perspiciatis magni autem, similique, nesciunt aut, eum nulla pariatur numquam tempora! Excepturi, eius.', 'Part time', '222Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt deleniti magnam sunt alias labore iusto? Deleniti deserunt perspiciatis magni autem, similique, nesciunt aut, eum nulla pariatur numquam tempora! Excepturi, eius.', 50, 2000),
(23, 3, 2, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque itaque asperiores, atque vel nihil facere eligendi quaerat iure rem ducimus commodi nesciunt nostrum, officia. Minus quasi dolores voluptates, consequuntur quibusdam!', 'Hydrograaff', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque itaque asperiores, atque vel nihil facere eligendi quaerat iure rem ducimus commodi nesciunt nostrum, officia. Minus quasi dolores voluptates, consequuntur quibusdam!', 50, 25),
(39, 8, 1, 'Test', 'Roc teacher', 'test 2', 50, 1111),
(40, 8, 1, 'Test 2 ', 'Roc teacher 2', 'test 2 2 ', 50, 2222);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bedrijf`
--
ALTER TABLE `bedrijf`
  ADD PRIMARY KEY (`bedrijfID`),
  ADD UNIQUE KEY `userID` (`userID`);

--
-- Indexes for table `functies`
--
ALTER TABLE `functies`
  ADD PRIMARY KEY (`functieID`);

--
-- Indexes for table `sollicitant`
--
ALTER TABLE `sollicitant`
  ADD PRIMARY KEY (`sollicitantID`),
  ADD UNIQUE KEY `userID` (`userID`),
  ADD UNIQUE KEY `sollicitantID` (`sollicitantID`);

--
-- Indexes for table `sollicitatie`
--
ALTER TABLE `sollicitatie`
  ADD PRIMARY KEY (`sollicitatieID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `vacatures`
--
ALTER TABLE `vacatures`
  ADD PRIMARY KEY (`vacatureID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bedrijf`
--
ALTER TABLE `bedrijf`
  MODIFY `bedrijfID` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `functies`
--
ALTER TABLE `functies`
  MODIFY `functieID` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `sollicitant`
--
ALTER TABLE `sollicitant`
  MODIFY `sollicitantID` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `sollicitatie`
--
ALTER TABLE `sollicitatie`
  MODIFY `sollicitatieID` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=30;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=54;
--
-- AUTO_INCREMENT for table `vacatures`
--
ALTER TABLE `vacatures`
  MODIFY `vacatureID` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=42;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
