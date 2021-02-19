const pool = require("../database");
const inventarioModel = require('../models/inventario');


//OBTENER EL LITADO DE TODOS LOS PRODUCTOS DEL INVENTARIO
exports.getProductos = function (req, res) {
    let query = 'SELECT *FROM inventario';
    pool.query(query, function (err, result) {
        if (result.length > 0) {
            res.status(200).json({
                mensaje: "OK",
                detalles: result,
            });
        } 
        else if((result.length == 0)){
            res.status(404).json({
                mensaje: "No existen registros en la base de datos.",
            });
        }
        else if (err) {
            res.status(400).json({
                mensaje: "Ha ocurrido un error",
                detalles: err
            });
        }
    });
};

//OBTENER UN PRODUCTO POR SU ID
exports.getProductoById = function (req, res) {
    const {idProducto} = req.params;
    console.log(req.params)

    let query = 'SELECT *FROM inventario WHERE idProducto=?';

    pool.query(query,[idProducto] ,function (err, result) {
        if (result.length > 0) {
            res.status(200).json({
                mensaje: "OK",
                detalles: result,
            });
        } 
        else if((result.length == 0)){
            res.status(404).json({
                mensaje: "No existe el registro con id: "+idProducto+" en la base de datos.",
            });
        }
        else if (err) {
            res.status(400).json({
                mensaje: "Ha ocurrido un error",
                detalles: err
            });
        }
       
    });
};

//AÑADIR UN PRODCUTO AL INVENTARIO
exports.addProducto =async (req,res)=>{
    let query = 'INSERT INTO inventario set ?';
    let requestBody = {
        descripcion: req.body.descripcion,
        tipoTaza   : req.body.tipoTaza,
        color      : req.body.color,
        altura     : req.body.altura,
        ancho      : req.body.ancho,
        capacidad  : req.body.capacidad,
        modelo     : req.body.modelo,
        material   : req.body.material,
        stock      : req.body.stock,
    };

    pool.query(query,[requestBody] ,function (err, result) {
        if (result) {
            console.log(result);
            console.log(result.lenght);
            res.status(200).json({
                mensaje: "Producto agregado correctamente al inventario.",
            });
        } else {
            res.status(400).json({
                mensaje: "Ocurrio un error al registrar el producto.",
                detalles: err
            });
        }
    });
}

//MODIFICAR UN PRODUCTO DEL INVENTARIO
exports.editProducto = function (req, res) {
    const {idProducto} = req.params;
    let requestBody = {
        descripcion: req.body.descripcion,
        tipoTaza   : req.body.tipoTaza,
        color      : req.body.color,
        altura     : req.body.altura,
        ancho      : req.body.ancho,
        capacidad  : req.body.capacidad,
        modelo     : req.body.modelo,
        material   : req.body.material,
        stock      : req.body.stock,
    };

    let query = 'UPDATE inventario SET ? where idProducto=?';

    pool.query(query,[requestBody,idProducto] ,function (err, result) {
        if (result) {
            console.log(result);
            console.log(result.lenght);
            res.status(200).json({
                mensaje: "Se modificó correctamente el producto con id: "+idProducto,
            });
        } else {
            res.status(400).json({
                mensaje: "Ocurrio un error al registrar.",
                detalles: err
            });
        }
    });
}

//ELIMINAR UN PRODUCTO DEL INVENTARIO
exports.deleteProducto = function (req, res) {
    console.log(req.params)
    const {idProducto} = req.params;
    let query = 'DELETE FROM inventario WHERE idProducto = ?';

    pool.query(query,[idProducto] ,function (err, result) {
        if (result) {
            console.log(result);
            console.log(result.lenght);
            res.status(200).json({
                mensaje: "Se eliminó el producto con id: "+idProducto,
            });
        } else {
            res.status(400).json({
                mensaje: "Ocurrio un error al eliminar el prodcuto.",
                detalles: err
            });
        }
    });
}