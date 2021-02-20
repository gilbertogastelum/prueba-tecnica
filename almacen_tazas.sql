CREATE DATABASE almacen_tazas;
USE almacen_tazas;


SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for tipo_taza
-- ----------------------------
DROP TABLE IF EXISTS `tipo_taza`;
CREATE TABLE `tipo_taza`  (
  `idTipoTaza`int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`idTipoTaza`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tipo_taza
-- ----------------------------
INSERT INTO `tipo_taza` VALUES (1, 'Alta Calidad');
INSERT INTO `tipo_taza` VALUES (2, 'Baja Calidad');

SET FOREIGN_KEY_CHECKS = 1;


-- ----------------------------
-- Table structure for inventario
-- ----------------------------
DROP TABLE IF EXISTS `inventario`;
CREATE TABLE `inventario`  (
  `idProducto` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `tipoTaza` int(10) UNSIGNED NOT NULL,
  `color` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `altura` int(10) UNSIGNED NOT NULL,
  `ancho` int(10) UNSIGNED NOT NULL,
  `capacidad` int(10) UNSIGNED NOT NULL,
  `modelo` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `material` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `stock` int(10) UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`idProducto`) USING BTREE,
  INDEX `TipoTaza`(`tipoTaza`) USING BTREE,
  CONSTRAINT `TipoTaza` FOREIGN KEY (`tipoTaza`) REFERENCES `tipo_taza` (`idTipoTaza`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of inventario
-- ----------------------------
INSERT INTO `inventario` VALUES (1, 'Taza Importada', 1, '#eae206', 18, 13, 320, 'IM-785599', 'Porcelana', 500);
INSERT INTO `inventario` VALUES (2, 'Taza de vidrio', 1, '#ff0000', 19, 14, 420, 'XL-785566', 'Vidrio', 410);


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
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of entrada
-- ----------------------------
INSERT INTO `entrada` VALUES (1, 'Compra de 100 tazas', 2, '2021-02-25 07:00:00.000000', 100);
INSERT INTO `entrada` VALUES (2, 'Compra de 310 tazas', 2, '2021-02-14 07:00:00.000000', 310);
INSERT INTO `entrada` VALUES (3, 'Compra de 500 tazas', 1, '2021-02-20 07:00:00.000000', 500);


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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of salida
-- ----------------------------


