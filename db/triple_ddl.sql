CREATE TABLE `photoData` (
  `id` varchar(255) NOT NULL,
  `deletedAt` datetime(6) DEFAULT NULL,
  `attachedReviewId` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_ATTACHEDREVIEWID` (`attachedReviewId`),
  CONSTRAINT `FK_ATTACHEDREVIEWID` FOREIGN KEY (`attachedReviewId`) REFERENCES `reviewData` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `placeData` (
  `id` varchar(255) NOT NULL,
  `firstReviewId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_FIRSTREVIEWID` (`firstReviewId`),
  CONSTRAINT `FK_FIRSTREVIEWID` FOREIGN KEY (`firstReviewId`) REFERENCES `reviewData` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `pointLogData` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `action` enum('ADD','MOD','DELETE') NOT NULL,
  `point` int(11) NOT NULL,
  `ownerId` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_OWNERID` (`ownerId`),
  CONSTRAINT `FK_OWNERID` FOREIGN KEY (`ownerId`) REFERENCES `userData` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `reviewData` (
  `id` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `deletedAt` datetime(6) DEFAULT NULL,
  `authorId` varchar(36) NOT NULL,
  `placeId` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_AUTHOR_PLACE` (`authorId`,`placeId`),
  KEY `FK_PLACEID` (`placeId`),
  CONSTRAINT `FK_AUTHORID` FOREIGN KEY (`authorId`) REFERENCES `userData` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_PLACEID` FOREIGN KEY (`placeId`) REFERENCES `placeData` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `userData` (
  `id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
