CREATE TABLE `photoData` (
  `id` varchar(255) NOT NULL,
  `deletedAt` datetime(6) DEFAULT NULL,
  `attachedReviewId` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `placeData` (
  `id` varchar(255) NOT NULL,
  `firstReviewId` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `pointLogData` (
  `id` int(11) NOT NULL,
  `timestamp` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `action` enum('ADD','MOD','DELETE') NOT NULL,
  `point` int(11) NOT NULL,
  `ownerId` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `reviewData` (
  `id` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `deletedAt` datetime(6) DEFAULT NULL,
  `authorId` varchar(36) NOT NULL,
  `placeId` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `userData` (
  `id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


ALTER TABLE `photoData`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_ATTACHEDREVIEWID` (`attachedReviewId`);

ALTER TABLE `placeData`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `REL_FIRSTREVIEWID` (`firstReviewId`);

ALTER TABLE `pointLogData`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_OWNERID` (`ownerId`);

ALTER TABLE `reviewData`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UQ_AUTHOR_PLACE` (`authorId`,`placeId`),
  ADD KEY `FK_PLACEID` (`placeId`);

ALTER TABLE `userData`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `pointLogData`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `photoData`
  ADD CONSTRAINT `FK_ATTACHEDREVIEWID` FOREIGN KEY (`attachedReviewId`) REFERENCES `reviewData` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `placeData`
  ADD CONSTRAINT `FK_FIRSTREVIEWID` FOREIGN KEY (`firstReviewId`) REFERENCES `reviewData` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `pointLogData`
  ADD CONSTRAINT `FK_OWNERID` FOREIGN KEY (`ownerId`) REFERENCES `userData` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `reviewData`
  ADD CONSTRAINT `FK_AUTHORID` FOREIGN KEY (`authorId`) REFERENCES `userData` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_PLACEID` FOREIGN KEY (`placeId`) REFERENCES `placeData` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
