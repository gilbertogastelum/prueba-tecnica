const pool = require("../database");
const inventarioModel = require('../models/inventario');


//OBTENER EL LITADO DE TODAS LAS ENTRADAS DE ALMACÉN
exports.getEntradas = function (req, res) {
    let query = 'SELECT *FROM entrada';
    pool.query(query, function (err, result) {
        if (result.length > 0) {
            res.status(200).json({
                mensaje: "OK",
                detalles: result,
            });
        } 
        else if((result.length == 0)){
            res.status(404).json({
                mensaje: "No existen registros de entrada de almacén en la base de datos.",
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

//OBTENER UNA ENTRADA DE ALMACÉN POR SU ID
exports.getEntradaById = function (req, res) {
    const {idEntrada} = req.params;
    console.log(req.params)

    let query = 'SELECT *FROM entrada WHERE idEntrada=?';

    pool.query(query,[idEntrada] ,function (err, result) {
        if (result.length > 0) {
            res.status(200).json({
                mensaje: "OK",
                detalles: result,
            });
        } 
        else if((result.length == 0)){
            res.status(404).json({
                mensaje: "No existe el registro de entrada de almacén con id: "+idEntrada+" en la base de datos.",
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
exports.addEntrada =async (req,res)=>{
    let query = 'INSERT INTO entrada set ?';
    let requestBody = {
        descripcion  : req.body.descripcion,
        idProducto   : req.body.idProducto,
        fechaEntrada : req.body.fechaEntrada,
        cantidad     : req.body.cantidad,
    };

    pool.query(query,[requestBody] ,function (err, result) {
        if (result) {
            console.log(result);
            console.log(result.lenght);
            res.status(200).json({
                mensaje: "Entrada de almacén registrada correctamente.",
            });
        } else {
            res.status(400).json({
                mensaje: "Ocurrio un error al registrar la entrada de almacén.",
                detalles: err
            });
        }
    });
}

//MODIFICAR UNA ENTRADA DE ALMACÉN
exports.editEntrada = function (req, res) {
    const {idEntrada} = req.params;
    let requestBody = {
        descripcion  : req.body.descripcion,
        idProducto   : req.body.idProducto,
        fechaEntrada : req.body.fechaEntrada,
        cantidad     : req.body.cantidad,
    };

    let query = 'UPDATE entrada SET ? where idEntrada=?';

    pool.query(query,[requestBody,idEntrada] ,function (err, result) {
        if (result) {
            console.log(result);
            console.log(result.lenght);
            res.status(200).json({
                mensaje: "Se modificó correctamente la entrada de almacén con id: "+idEntrada,
            });
        } else {
            res.status(400).json({
                mensaje: "Ocurrio un error al registrar la entrada de almacén.",
                detalles: err
            });
        }
    });
}

//ELIMINAR UNA ENTRADA DE ALMACEN
exports.deleteEntrada = function (req, res) {
    console.log(req.params)
    const {idEntrada} = req.params;
    let query = 'DELETE FROM entrada WHERE idEntrada = ?';

    pool.query(query,[idEntrada] ,function (err, result) {
        if (result) {
            res.status(200).json({
                mensaje: "Se eliminó la entrada de almacén con id: "+idEntrada,
            });
        } else {
            res.status(400).json({
                mensaje: "Ocurrio un error al eliminar la entrada de almacén.",
                detalles: err
            });
        }
    });
}