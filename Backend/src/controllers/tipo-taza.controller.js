const pool = require("../database");
const {tipoTazaModel} = require('../models/tipo-taza');


//Obtener el listado de todos los tipos de taza por su calidad
exports.getTiposTaza = function (req, res) {
    //Query para obtener todos los tipos de taza
    let query = 'SELECT *FROM tipo_taza';

    //Se inicia la consulta
    pool.query(query, function (err, result) {
         //Comprobamos de que exista un resultado, si existe, lo retornaos
        if (result.length > 0) {
            res.status(200).json({
                mensaje: "OK",
                detalles: result,
            });
        } 
        //Si no hay resultado retornamos el error
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

//Obtener un tipo de taza por su ID 
exports.getTipoTazaById = function (req, res) {
    //Obtnemos el ID
    const {idTipoTaza} = req.params;

    //Query para obtener un tipo de taza por su ID
    let query = 'SELECT *FROM tipo_taza WHERE idTipoTaza=?';

    //Se inicia la consulta
    pool.query(query,[idTipoTaza] ,function (err, result) {
        //Comprobamos de que exista un resultado, si existe, lo retornaos
        if (result.length > 0) {
            res.status(200).json({
                mensaje: "OK",
                detalles: result,
            });
        } 
        //Si no hay resultado retornamos el error
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

//Añadir un nuevo tipo de taza
exports.addTipoTaza =async (req,res)=>{
    //Query para agregar un nuevo tipo de taza
    let query = 'INSERT INTO tipo_taza set ?';
    let requestBody = {
        descripcion: req.body.tipoTaza.descripcion,
    };

    //Validamos el request con joi
    try{
        await tipoTazaModel.validateAsync(requestBody);
    }catch(error){
        return res.status(400).json({
            mensaje:"Petición invalida",
            detalles:error['details']
        });
    }

    //Iniciamos la consulta
    pool.query(query,[requestBody] ,function (err, result) {
        //Comprobamos de que exista un resultado, si existe, lo retorna
        if (result) {
            res.status(200).json({
                mensaje: "OK",
                detalles: "Tipo de taza registrado correctamente.",
            });
            //Si no hay resultado retornamos el error
        } else {
            res.status(400).json({
                mensaje: "Ocurrio un error al registrar el tipo de taza.",
                detalles: err
            });
        }
    });
}

//Modificar un tipo de taza
exports.editTipoTaza = async (req, res)=> {
    //Obtenemos el ID del tipo de taza que queremos modificar
    const {idTipoTaza} = req.params;

    let requestBody = {
        descripcion: req.body.tipoTaza.descripcion,
    };

    //Validamos el request con joi
    try{
        await tipoTazaModel.validateAsync(requestBody);
    }catch(error){
        return res.status(400).json({
            mensaje:"Petición invalida",
            detalles:error['details']
        });
    }

    //Consulta para modificar un tipo de taza
    let query = 'UPDATE tipo_taza SET ? where idTipoTaza=?';

    //Iniciamos la consulta
    pool.query(query,[requestBody,idTipoTaza] ,function (err, result) {
        if (result) {
            //Comprobamos de que exista un resultado, si existe, lo retorna
            res.status(200).json({
                mensaje: "OK",
                detalles: "Se modificó correctamente el tipo de taza con id: "+idTipoTaza,
            });
             //Si no hay resultado retornamos el error
        } else {
            res.status(400).json({
                mensaje: "Ocurrio un error al modificar el tipo de taza.",
                detalles: err
            });
        }
    });
}

//Eliminar un tipo de taza
exports.deleteTipoTaza = function (req, res) {
    //Obtenemos el ID del tipo de taza que queremos eliminar
    const {idTipoTaza} = req.params;

    //Query para eliminar un tipo de taza
    let query = 'DELETE FROM tipo_taza WHERE idTipoTaza = ?';

    //Iniciamos la consulta
    pool.query(query,[idTipoTaza] ,function (err, result) {
        //Comprobamos de que exista un resultado, si existe, lo retorna
        if (result) {
            res.status(200).json({
                mensaje: "OK",
                detalles: "Se eliminó el tipo de taza con id: "+idTipoTaza,
            });
            //Si no hay resultado retornamos el error
        } else {
            res.status(400).json({
                mensaje: "Ocurrio un error al eliminar el tipo de taza.",
                detalles: err
            });
        }
    });
}