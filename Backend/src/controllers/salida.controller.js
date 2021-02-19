const pool = require("../database");
const inventarioModel = require('../models/inventario');


//OBTENER EL LITADO DE TODAS LAS SALIDAS DE INVENTARIO
exports.getSalidas = function (req, res) {
    let query = 'SELECT *FROM salida';
    pool.query(query, function (err, result) {
        if (result.length > 0) {
            res.status(200).json({
                mensaje: "OK",
                detalles: result,
            });
        } 
        else if((result.length == 0)){
            res.status(404).json({
                mensaje: "No existen registros de salida de almacén en la base de datos.",
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

//OBTENER UNA SALIDA DE ALMACÉN POR SU ID
exports.getSalidaById = function (req, res) {
    const {idSalida} = req.params;
    console.log(req.params)

    let query = 'SELECT *FROM salida WHERE idSalida=?';

    pool.query(query,[idSalida] ,function (err, result) {
        if (result.length > 0) {
            res.status(200).json({
                mensaje: "OK",
                detalles: result,
            });
        } 
        else if((result.length == 0)){
            res.status(404).json({
                mensaje: "No existe el registro de salida de almacén con id: "+idSalida+" en la base de datos.",
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

//AÑADIR UNA SALIDA DE ALMACÉN
exports.addSalida =async (req,res)=>{
    let query = 'INSERT INTO salida set ?';
    let requestBody = {
        descripcion  : req.body.descripcion,
        idProducto   : req.body.idProducto,
        fechaSalida  : req.body.fechaSalida,
        cantidad     : req.body.cantidad,
    };

    pool.query(query,[requestBody] ,function (err, result) {
        if (result) {
            console.log(result);
            console.log(result.lenght);
            res.status(200).json({
                mensaje: "Salida de almacén registrada correctamente.",
            });
        } else {
            res.status(400).json({
                mensaje: "Ocurrio un error al registrar la salida de almacén.",
                detalles: err
            });
        }
    });
}

//MODIFICAR UN SALIDA DE ALMACÉM
exports.editSalida = function (req, res) {
    const {idSalida} = req.params;
    let requestBody = {
        descripcion  : req.body.descripcion,
        idProducto   : req.body.idProducto,
        fechaSalida : req.body.fechaSalida,
        cantidad     : req.body.cantidad,
    };

    let query = 'UPDATE salida SET ? where idSalida=?';

    pool.query(query,[requestBody,idSalida] ,function (err, result) {
        if (result) {
            console.log(result);
            console.log(result.lenght);
            res.status(200).json({
                mensaje: "Se modificó correctamente la salida de almacén con id: "+idSalida,
            });
        } else {
            res.status(400).json({
                mensaje: "Ocurrio un error al modificar la salida de almacén.",
                detalles: err
            });
        }
    });
}

//ELIMINAR UNA SALIDA DE ALMACÉM
exports.deleteSalida = function (req, res) {
    console.log(req.params)
    const {idSalida} = req.params;
    let query = 'DELETE FROM salida WHERE idSalida = ?';

    pool.query(query,[idSalida] ,function (err, result) {
        if (result) {
            res.status(200).json({
                mensaje: "Se eliminó la salida de almacén con id: "+idSalida,
            });
        } else {
            res.status(400).json({
                mensaje: "Ocurrio un error al eliminar la salida de almacén.",
                detalles: err
            });
        }
    });
}