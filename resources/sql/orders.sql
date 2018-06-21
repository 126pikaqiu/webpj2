--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `userID` int(11) NOT NULL,
  `orderID` int(11) NOT NULL,
  `ownerID` int(11) NOT NULL,
  `artworkID` int(11) NOT NULL,
  `timeCreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderID`);

