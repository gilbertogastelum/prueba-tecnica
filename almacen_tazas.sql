CREATE DATABASE almacen_tazas;
USE almacen_tazas;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for entrada
-- ----------------------------
DROP TABLE IF EXISTS `entrada`;
CREATE TABLE `entrada`  (
  `idEntrada` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `idProducto` int(10) UNSIGNED NOT NULL,
  `fechaEntrada` datetime(6) NOT NULL,
  `cantidad` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`idEntrada`) USING BTREE,
  INDEX `idProductos`(`idProducto`) USING BTREE,
  CONSTRAINT `idProductos` FOREIGN KEY (`idProducto`) REFERENCES `inventario` (`idProducto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of entrada
-- ----------------------------
INSERT INTO `entrada` VALUES (1, 'Se comparon 800 tazas', 3, '2021-02-19 07:00:00.000000', 800);
INSERT INTO `entrada` VALUES (2, 'Se comparon 400 tazas', 3, '2021-02-19 07:00:00.000000', 400);
INSERT INTO `entrada` VALUES (3, 'Se comparon 150 tazas', 1, '2021-02-01 07:00:00.000000', 150);
INSERT INTO `entrada` VALUES (4, 'Se comparon 75 tazas', 2, '2021-02-20 07:00:00.000000', 75);
INSERT INTO `entrada` VALUES (5, 'Se comparon 120 tazas', 4, '2021-02-19 07:00:00.000000', 120);
INSERT INTO `entrada` VALUES (6, 'Se comparon 300 tazas', 5, '2021-02-20 07:00:00.000000', 300);
INSERT INTO `entrada` VALUES (7, 'Se comparon 250 tazas', 3, '2021-02-20 07:00:00.000000', 250);

-- ----------------------------
-- Table structure for inventario
-- ----------------------------
DROP TABLE IF EXISTS `inventario`;
CREATE TABLE `inventario`  (
  `idProducto` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `tipoTaza` int(10) UNSIGNED NOT NULL,
  `color` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `altura` double(10, 2) UNSIGNED NOT NULL,
  `ancho` double(10, 2) UNSIGNED NOT NULL,
  `capacidad` double(10, 2) UNSIGNED NOT NULL,
  `modelo` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `material` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `stock` int(10) UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`idProducto`) USING BTREE,
  INDEX `TipoTaza`(`tipoTaza`) USING BTREE,
  CONSTRAINT `TipoTaza` FOREIGN KEY (`tipoTaza`) REFERENCES `tipo_taza` (`idTipoTaza`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of inventario
-- ----------------------------
INSERT INTO `inventario` VALUES (1, 'Taza disney', 1, '#016ac6', 14.10, 10.20, 355.90, 'DN-746588', 'Plastico', 145);
INSERT INTO `inventario` VALUES (2, 'Taza Ceramica', 1, '#4d0000', 14.60, 10.50, 340.00, 'TC-126504', 'Ceramica', 75);
INSERT INTO `inventario` VALUES (3, 'Taza té', 2, '#000000', 13.30, 10.00, 414.00, 'CT-456502', 'Vidrio', 931);
INSERT INTO `inventario` VALUES (4, 'Taza de marca', 1, '#000000', 10.70, 10.80, 360.00, 'CM-980311', 'Ceramica', 120);
INSERT INTO `inventario` VALUES (5, 'Taza marvel', 1, '#ff0000', 9.80, 8.82, 350.00, 'TM-548900', 'Plastico', 200);

-- ----------------------------
-- Table structure for salida
-- ----------------------------
DROP TABLE IF EXISTS `salida`;
CREATE TABLE `salida`  (
  `idSalida` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `idProducto` int(10) UNSIGNED NOT NULL,
  `fechaSalida` datetime(6) NOT NULL,
  `cantidad` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`idSalida`) USING BTREE,
  INDEX `idProducto`(`idProducto`) USING BTREE,
  CONSTRAINT `idProducto` FOREIGN KEY (`idProducto`) REFERENCES `inventario` (`idProducto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of salida
-- ----------------------------
INSERT INTO `salida` VALUES (1, 'Se vendieron 100 tazas', 5, '2021-02-20 07:00:00.000000', 100);
INSERT INTO `salida` VALUES (2, 'Salida por promoción', 3, '2021-02-20 07:00:00.000000', 30);
INSERT INTO `salida` VALUES (3, 'Se vendieron 400 tazas', 3, '2021-02-20 07:00:00.000000', 400);
INSERT INTO `salida` VALUES (4, 'Salida por promoción', 3, '2021-02-20 07:00:00.000000', 80);
INSERT INTO `salida` VALUES (5, 'Se vendieron 5 tazas', 1, '2021-02-20 07:00:00.000000', 5);
INSERT INTO `salida` VALUES (6, 'Se vendieron 9 tazas', 3, '2021-02-20 07:00:00.000000', 9);

-- ----------------------------
-- Table structure for tipo_taza
-- ----------------------------
DROP TABLE IF EXISTS `tipo_taza`;
CREATE TABLE `tipo_taza`  (
  `idTipoTaza` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`idTipoTaza`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of tipo_taza
-- ----------------------------
INSERT INTO `tipo_taza` VALUES (1, 'Alta calidad');
INSERT INTO `tipo_taza` VALUES (2, 'Baja calidad');

SET FOREIGN_KEY_CHECKS = 1;
