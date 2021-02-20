const pool = require("../database");
const {entradaModel} = require('../models/entrada');


//Obtener el listado de todas las entradas a almacén
exports.getEntradas = function (req, res) {
    //Query para obtener todas las entradas de almacén
    let query = 'SELECT *FROM entrada';

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

//Obtener una entrada de almacén por su id
exports.getEntradaById = function (req, res) {
    //Obtenemos el ID de la entrada que queremos modificar
    const {idEntrada} = req.params;

    //Query para obtener entrada por id
    let query = 'SELECT *FROM entrada WHERE idEntrada=?';

    //Se inicia la consulta
    pool.query(query,[idEntrada] ,function (err, result) {
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

//Proceso de entrada a inventario y suma de stock
exports.addEntrada =async (req,res)=>{
    //Query para insertar una entrada de almacén
    let query = 'INSERT INTO entrada set ?';
    let requestBody = {
        descripcion  : req.body.entrada.descripcion,
        idProducto   : req.body.entrada.idProducto,
        fechaEntrada : req.body.entrada.fechaEntrada,
        cantidad     : req.body.entrada.cantidad,
    };
    //Validamos el request con joi
    try{
        await entradaModel.validateAsync(requestBody);
    }catch(error){
        return res.status(400).json({
            mensaje:"Petición invalida",
            detalles:error['details']
        });
    }

    
    let cantidad= req.body.entrada.cantidad;//Obtenemos la cantidad de tazas que entran a almacén para luego sumar el stock al inventario
    let idProducto= req.body.entrada.idProducto;//Obtenemos el ID del producto que entra a almacén para luego sumarle la cantidad en la tabla inventario

    //Se inicia la consulta
    pool.query(query,[requestBody] ,function (err, result) {
        if (result) {
            //Query para sumar al almacén las unidades que entrarón
            let queryUpdateInventario = 'UPDATE inventario set stock = stock + ? WHERE idProducto = ?';
            pool.query(queryUpdateInventario,[cantidad,idProducto],function (err) {
                //Comprobamos si no existen errores, si existen, lo retornamos
                if(err){
                    pool.rollback(()=>{
                        console.log(err.message);
                    })
                    return res.status(400).json({
                        mensaje: "Ocurrio un error al modificar el almacén",
                        detalles: err
                    });
                }else{
                    //Si no existen errores, entonces registro exitoso.
                    res.status(200).json({
                        mensaje: "OK",
                        detalles: "Entrada de almacén registrada correctamente. Se registraron "+cantidad+" Unidades",
                    });
                }
            });
        } else {
            res.status(400).json({
                mensaje: "Ocurrio un error al registrar la entrada de almacén.",
                detalles: err
            });
        }
    });
}
