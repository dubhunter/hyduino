CREATE TABLE `triggers` (
  `trigger_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `event_name` varchar(255) NOT NULL,
  `trigger_name` varchar(255) NOT NULL,
  `trigger_type` int(11) NOT NULL,
  `trigger_value` varchar(32) DEFAULT NULL,
  `alert_type` int(11) NOT NULL,
  `alert_msg` varchar(255) NOT NULL,
  `alert_recipient` varchar(255) NOT NULL,
  `enabled` tinyint(4) NOT NULL DEFAULT '0',
  `date_created` datetime NOT NULL,
  `date_updated` datetime NOT NULL,
  PRIMARY KEY (`trigger_id`),
  KEY `event` (`event_name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;