CREATE TABLE IF NOT EXISTS `odor_game_registration` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
    `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
    `send_time` datetime NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=47 ;