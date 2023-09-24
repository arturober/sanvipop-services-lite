-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: mariadb
-- Tiempo de generación: 10-09-2023 a las 20:25:19
-- Versión del servidor: 10.11.4-MariaDB
-- Versión de PHP: 8.2.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sanvipop`
--
CREATE DATABASE IF NOT EXISTS `sanvipop` DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci;
USE `sanvipop`;

DELIMITER $$
--
-- Funciones
--
CREATE DEFINER=`root`@`localhost` FUNCTION `haversine` (`lat1` FLOAT, `lon1` FLOAT, `lat2` FLOAT, `lon2` FLOAT) RETURNS FLOAT DETERMINISTIC NO SQL COMMENT 'Returns the distance in degrees on the Earth\r\n             between two known points of latitude and longitude' BEGIN
    RETURN DEGREES(
        	ACOS(
              COS(RADIANS(lat1)) *
              COS(RADIANS(lat2)) *
              COS(RADIANS(lon2) - RADIANS(lon1)) +
              SIN(RADIANS(lat1)) * SIN(RADIANS(lat2))
            )
    	  )*111.045;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `category`
--

CREATE TABLE `category` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Volcado de datos para la tabla `category`
--

INSERT INTO `category` (`id`, `name`) VALUES
(1, 'Electronics'),
(2, 'Motor and vehicles'),
(3, 'Sports and hobbies'),
(4, 'Consoles and videogames'),
(5, 'Books, movies and music'),
(6, 'Fashion'),
(7, 'Kids and babies'),
(8, 'Real state'),
(9, 'Home appliances'),
(10, 'Other');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `product`
--

CREATE TABLE `product` (
  `id` int(10) UNSIGNED NOT NULL,
  `datePublished` timestamp NOT NULL DEFAULT current_timestamp(),
  `title` varchar(250) NOT NULL,
  `description` varchar(2000) NOT NULL,
  `status` tinyint(3) UNSIGNED NOT NULL DEFAULT 1 COMMENT '1- selling, 2 - reserved, 3 - sold',
  `price` double NOT NULL,
  `idUser` int(10) UNSIGNED NOT NULL,
  `numVisits` int(11) NOT NULL DEFAULT 0,
  `idCategory` tinyint(3) UNSIGNED NOT NULL,
  `mainPhoto` int(10) UNSIGNED DEFAULT NULL,
  `soldTo` int(10) UNSIGNED DEFAULT NULL COMMENT 'The user this product was sold to'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `product_bookmark`
--

CREATE TABLE `product_bookmark` (
  `idProduct` int(10) UNSIGNED NOT NULL,
  `idUser` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci COMMENT='Users favorite products';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `product_photo`
--

CREATE TABLE `product_photo` (
  `id` int(10) UNSIGNED NOT NULL,
  `idProduct` int(10) UNSIGNED NOT NULL,
  `url` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `transaction`
--

CREATE TABLE `transaction` (
  `idSeller` int(10) UNSIGNED NOT NULL,
  `idBuyer` int(10) UNSIGNED NOT NULL,
  `idProduct` int(10) UNSIGNED NOT NULL,
  `sellerRating` tinyint(4) DEFAULT NULL,
  `buyerRating` tinyint(4) DEFAULT NULL,
  `sellerComment` varchar(2000) DEFAULT NULL,
  `buyerComment` varchar(2000) DEFAULT NULL,
  `dateTransaction` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Disparadores `transaction`
--
DELIMITER $$
CREATE TRIGGER `update product insert` AFTER INSERT ON `transaction` FOR EACH ROW UPDATE product SET product.status = 3, product.soldTo = NEW.idBuyer WHERE product.id = NEW.idProduct
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` int(10) UNSIGNED NOT NULL,
  `registrationDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `name` varchar(250) NOT NULL,
  `email` varchar(250) NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `lat` double NOT NULL,
  `lng` double NOT NULL,
  `role` tinyint(4) NOT NULL COMMENT '1 ADMIN, 2 USER',
  `photo` varchar(200) NOT NULL,
  `idGoogle` varchar(100) DEFAULT NULL,
  `idFacebook` varchar(100) DEFAULT NULL,
  `firebaseToken` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mainPhoto_2` (`mainPhoto`),
  ADD KEY `idUser` (`idUser`),
  ADD KEY `idCategory` (`idCategory`),
  ADD KEY `mainPhoto` (`mainPhoto`),
  ADD KEY `soldTo` (`soldTo`),
  ADD KEY `datePublished` (`datePublished`);

--
-- Indices de la tabla `product_bookmark`
--
ALTER TABLE `product_bookmark`
  ADD PRIMARY KEY (`idProduct`,`idUser`),
  ADD KEY `idUser` (`idUser`);

--
-- Indices de la tabla `product_photo`
--
ALTER TABLE `product_photo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idUser` (`idProduct`);

--
-- Indices de la tabla `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`idProduct`),
  ADD KEY `idSeller` (`idSeller`),
  ADD KEY `idBuyer` (`idBuyer`),
  ADD KEY `idProduct` (`idProduct`),
  ADD KEY `dateTransaction` (`dateTransaction`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `category`
--
ALTER TABLE `category`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `product`
--
ALTER TABLE `product`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=852;

--
-- AUTO_INCREMENT de la tabla `product_photo`
--
ALTER TABLE `product_photo`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=817;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=302;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_ibfk_2` FOREIGN KEY (`idCategory`) REFERENCES `category` (`id`),
  ADD CONSTRAINT `product_ibfk_3` FOREIGN KEY (`mainPhoto`) REFERENCES `product_photo` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  ADD CONSTRAINT `product_ibfk_4` FOREIGN KEY (`soldTo`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Filtros para la tabla `product_bookmark`
--
ALTER TABLE `product_bookmark`
  ADD CONSTRAINT `product_bookmark_ibfk_1` FOREIGN KEY (`idProduct`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_bookmark_ibfk_2` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `product_photo`
--
ALTER TABLE `product_photo`
  ADD CONSTRAINT `product_photo_ibfk_1` FOREIGN KEY (`idProduct`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `transaction`
--
ALTER TABLE `transaction`
  ADD CONSTRAINT `transaction_ibfk_1` FOREIGN KEY (`idSeller`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `transaction_ibfk_2` FOREIGN KEY (`idBuyer`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `transaction_ibfk_3` FOREIGN KEY (`idProduct`) REFERENCES `product` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
