const pool = require("../database");
const inventarioModel = require('../models/inventario');


//TIPO DE TAZA 1 : CALIDAD ALTA
//TIPO DE TAZA 2 : CALIDAD BAJA

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
exports.addSalida = function (req,res){
    let query = 'INSERT INTO salida set ?';
    let requestBody = {
        descripcion  : req.body.salida.descripcion,
        idProducto   : req.body.salida.idProducto,
        fechaSalida  : req.body.salida.fechaSalida,
        cantidad     : req.body.salida.cantidad,
    };

    let cantidad= req.body.salida.cantidad;//OBTENER LA CANTIDAD DE TAZAS QUE SALEN DE ALMACÉN PARA RESTARLAS DEL INVENTARIO
    let idTipoTaza  = req.body.salida.idTipoTaza;/*OBTENER EL TIPO DE TAZA PARA DETERMINAR QUE TIPO DE TAZA SE REGALA EN CASO DE QUE CUMPLA
                                                   CON LOS CRITERIOS DE LA PROMCIÓN */
    let tazasRegaladas;
    let idProducto= req.body.salida.idProducto;
    let idProductoPromocion;
    let stockProductoPromocion;

    pool.query(query,[requestBody] ,function (err, result) {
        if (result) {
            
            //EMPIEZA QUERY PARA RESTAR DEL ALMACÉN LA CANTIDAD DE PRODUCTO QUE SALIÓ.
            let queryUpdateInventario = 'UPDATE inventario set stock = stock - ? WHERE idProducto = ?';
            pool.query(queryUpdateInventario,[cantidad,idProducto],function (err) {
                if(err){
                    pool.rollback(()=>{
                        console.log(err.message);
                    })
                    return res.status(400).json({
                        mensaje: "Ocurrio un error al modificar el almacén",
                        detalles: err
                    });
                }
            });


            let auxModTazas=Math.trunc((cantidad/=10));
            if(auxModTazas>=1){
                //COMPROBAR SI SON TAZAS DE CALIDAD ALTA
                if(idTipoTaza==1){
                    tazasRegaladas=3*auxModTazas;
                //COMPROBAR SI SON TAZAS DE CALIDAD BAJA
                }else if(idTipoTaza==2){
                    tazasRegaladas=2*auxModTazas;
                }

                console.log("TAZAS A REGALAR : "+tazasRegaladas);
                //EMPIEZA QUERY PARA OBTENER DEL INVENTARIO EL PRODUCTO DE CÁLIDAD BAJA PARA APLICAR LA PROMOCIÓN
                
                //CON ESTA CONSULA ES PARA OBTENER EL ID DEL PRODUCTO DE BAJA CALIDAD CON MAYOR STOCK PARA APLICAR LA PROMCIÓN
                let querySelectInventarioCalidadBaja="SELECT stock, idProducto FROM inventario WHERE tipoTaza=2 ORDER BY stock DESC LIMIT 1";
                
                pool.query(querySelectInventarioCalidadBaja,function (err,result) {
                    if(err){
                        pool.rollback(()=>{
                            console.log(err.message);
                        })
                        return res.status(400).json({
                            mensaje: "Ocurrio un error al modificar el almacén",
                            detalles: err
                        });
                    }else{
                        stockProductoPromocion= result[0].stock;
                        idProductoPromocion=result[0].idProducto;
                        console.log("ID DEL PRODUCTO A REGALAR: ",idProductoPromocion);
                        console.log("STOCK DEL PRODUCTO A REGALAR :",stockProductoPromocion);

                         //COMPRBAMOS QUE EL STOCK DEL PRODCUTO QUE SE REGALA EN LA PROMOCIÓN SEA MAYOR A LA CANTIDAD DE TAZAS A REGALAR.
                        if (stockProductoPromocion>tazasRegaladas){
                            //CON ESTA CONSULTA RESTAMOS STOCK DEL PRODUCTO QUE SE REGALÁ POR PROMOCIÓN
                            let queryUpdateStockProductoPromocion="UPDATE inventario SET stock = stock -? WHERE idProducto = ?";
                            pool.query(queryUpdateStockProductoPromocion,[tazasRegaladas,idProductoPromocion],function (err,result) {
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
                                        detalles: "Salida de almacén registrada correctamente. Se aplicó la promoción con "+tazasRegaladas+" tazas de baja calidad regaladas.",
                                    });
                                }
                            });
                        }
                    }
                });
                //EN CASO DE QUE NO APLIQUE LA PROMOCIÓN ENVIAMOS ESTE MENSAJE
            }else{
                res.status(200).json({
                    mensaje: "OK",
                    detalles: "Salida de almacén registrada correctamente. No se aplicó ninguna promoción",
                });
            }

        } else {
            console.log(err);
            res.status(400).json({
                mensaje: "Ocurrio un error al registrar la salida de almacén.",
                detalles: err
            });
        }
    });
}
