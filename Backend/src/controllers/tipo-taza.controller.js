const pool = require("../database");
const {tipoTazaModel} = require('../models/tipo-taza');


//OBTENER EL LITADO DE TODOS LOS TIPO DE TAZAS POR SU CALIDAD
exports.getTiposTaza = function (req, res) {
    let query = 'SELECT *FROM tipo_taza';
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

//OBTENER UN TIPO DE TAZA POR SU ID
exports.getTipoTazaById = function (req, res) {
    const {idTipoTaza} = req.params;
    console.log(req.params)

    let query = 'SELECT *FROM tipo_taza WHERE idTipoTaza=?';

    pool.query(query,[idTipoTaza] ,function (err, result) {
        if (result.length > 0) {
            res.status(200).json({
                mensaje: "OK",
                detalles: result,
            });
        } 
        else if((result.length == 0)){
            res.status(404).json({
                mensaje: "No existe el registro con id: "+idTipoTaza+" en la base de datos.",
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

//AÑADIR UN TIPO DE TAZA
exports.addTipoTaza =async (req,res)=>{
    let query = 'INSERT INTO tipo_taza set ?';
    let requestBody = {
        descripcion: req.body.tipoTaza.descripcion,
    };

    //VALIDAMOS EL REQUEST CON JOI
    try{
        await tipoTazaModel.validateAsync(requestBody);
    }catch(error){
        return res.status(400).json({
            mensaje:"Petición invalida",
            detalles:error['details']
        });
    }

    pool.query(query,[requestBody] ,function (err, result) {
        if (result) {
            res.status(200).json({
                mensaje: "OK",
                detalles: "Tipo de taza registrado correctamente.",
            });
        } else {
            res.status(400).json({
                mensaje: "Ocurrio un error al registrar el tipo de taza.",
                detalles: err
            });
        }
    });
}

//MODIFICAR UN TIPO DE TAZA
exports.editTipoTaza = async (req, res)=> {
    //OBTENEMOS EL ID QUE DESEAMOS MODIFICAR
    const {idTipoTaza} = req.params;

    let requestBody = {
        descripcion: req.body.tipoTaza.descripcion,
    };

    //VALIDAMOS EL REQUEST CON JOI
    try{
        await tipoTazaModel.validateAsync(requestBody);
    }catch(error){
        return res.status(400).json({
            mensaje:"Petición invalida",
            detalles:error['details']
        });
    }

    //CONSULTA PARA MODIFICAR UN TIPO DE TAZA
    let query = 'UPDATE tipo_taza SET ? where idTipoTaza=?';

    //SE INICIA LA CONSULTA
    pool.query(query,[requestBody,idTipoTaza] ,function (err, result) {
        if (result) {
            res.status(200).json({
                mensaje: "OK",
                detalles: "Se modificó correctamente el tipo de taza con id: "+idTipoTaza,
            });
        } else {
            res.status(400).json({
                mensaje: "Ocurrio un error al modificar el tipo de taza.",
                detalles: err
            });
        }
    });
}

//ELIMINAR TIPO DE TAZA
exports.deleteTipoTaza = function (req, res) {
    console.log(req.params)
    const {idTipoTaza} = req.params;
    let query = 'DELETE FROM tipo_taza WHERE idTipoTaza = ?';

    pool.query(query,[idTipoTaza] ,function (err, result) {
        if (result) {
            res.status(200).json({
                mensaje: "OK",
                detalles: "Se eliminó el tipo de taza con id: "+idTipoTaza,
            });
        } else {
            res.status(400).json({
                mensaje: "Ocurrio un error al eliminar el tipo de taza.",
                detalles: err
            });
        }
    });
}