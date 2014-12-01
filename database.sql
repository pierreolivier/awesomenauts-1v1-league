/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Export de la structure de table davew_1v1_league. group
CREATE TABLE IF NOT EXISTS `group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- L'exportation de données n'été pas sélectionné.


-- Export de la structure de table davew_1v1_league. match
CREATE TABLE IF NOT EXISTS `match` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_player_1` int(11) NOT NULL,
  `id_player_2` int(11) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_player_1` (`id_player_1`),
  KEY `id_player_2` (`id_player_2`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- L'exportation de données n'été pas sélectionné.


-- Export de la structure de table davew_1v1_league. player
CREATE TABLE IF NOT EXISTS `player` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL,
  `seed` varchar(50) NOT NULL DEFAULT '1st',
  `steam_profile` varchar(250) NOT NULL,
  `wins` int(11) NOT NULL DEFAULT '0',
  `losses` int(11) NOT NULL DEFAULT '0',
  `points` int(11) NOT NULL DEFAULT '0',
  `with_wins` int(11) NOT NULL DEFAULT '0',
  `with_losses` int(11) NOT NULL DEFAULT '0',
  `id_group` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_group` (`id_group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- L'exportation de données n'été pas sélectionné.


-- Export de la structure de table davew_1v1_league. round
CREATE TABLE IF NOT EXISTS `round` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_match` int(11) NOT NULL,
  `picker` int(11) NOT NULL DEFAULT '1',
  `score_player_1` int(11) NOT NULL,
  `score_player_2` int(11) NOT NULL,
  `naut_player_1` int(11) NOT NULL,
  `naut_player_2` int(11) NOT NULL,
  `map` int(11) NOT NULL,
  `screenshot` varchar(250) NOT NULL,
  `replay` varchar(250) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_match` (`id_match`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- L'exportation de données n'été pas sélectionné.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
