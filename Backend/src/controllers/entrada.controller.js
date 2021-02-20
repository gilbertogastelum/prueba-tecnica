const pool = require("../database");
const {entradaModel} = require('../models/entrada');


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

//PROCESO DE ENTRADA AL INVENTARIO Y SUMA AL INVENTARIO
exports.addEntrada =async (req,res)=>{
    let query = 'INSERT INTO entrada set ?';
    let requestBody = {
        descripcion  : req.body.entrada.descripcion,
        idProducto   : req.body.entrada.idProducto,
        fechaEntrada : req.body.entrada.fechaEntrada,
        cantidad     : req.body.entrada.cantidad,
    };

    //VALIDAMOS EL REQUEST CON JOI
    try{
        await entradaModel.validateAsync(requestBody);
    }catch(error){
        return res.status(400).json({
            mensaje:"Petición invalida",
            detalles:error['details']
        });
    }


    let cantidad= req.body.entrada.cantidad;//OBTENER LA CANTIDAD DE TAZAS QUE ENTRAN A ALMACÉN PARA SUMARLAS AL INVENTARIO
    let idProducto= req.body.entrada.idProducto;//OBTENER EL ID DEL PRODCUTO QUE ENTRA AL ALMACÉN PARA SUMARLE LA CANTIDAD EN LA TABLA INVENTARIO.

    pool.query(query,[requestBody] ,function (err, result) {
        if (result) {
            //EMPIEZA CONSULTA PARA SUMAR AL ALMACÉN LA CANTIDAD DE PRODUCTO ENTRÓ.
            let queryUpdateInventario = 'UPDATE inventario set stock = stock + ? WHERE idProducto = ?';
            pool.query(queryUpdateInventario,[cantidad,idProducto],function (err) {
                if(err){
                    pool.rollback(()=>{
                        console.log(err.message);
                    })
                    return res.status(400).json({
                        mensaje: "Ocurrio un error al modificar el almacén",
                        detalles: err
                    });
                }else{
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
