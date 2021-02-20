const pool = require("../database");
const { salidaModel } = require('../models/salida');

//TIPOS DE TAZA
//TIPO DE TAZA 1 : CALIDAD ALTA
//TIPO DE TAZA 2 : CALIDAD BAJA

//Obtener el listado de todas las salidas de inventario
exports.getSalidas = function (req, res) {
    //Query para obtener todas las salidas de almacén
    let query = 'SELECT *FROM salida';

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
        else if ((result.length == 0)) {
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

//Obtener una salida de almacén por su id
exports.getSalidaById = function (req, res) {
    //Obenemos el id de la salida de almacén
    const { idSalida } = req.params;

    //Query para obtener una salida de almacén por su ID
    let query = 'SELECT *FROM salida WHERE idSalida=?';

    //Se inicia la consulta
    pool.query(query, [idSalida], function (err, result) {
        //Comprobamos de que exista un resultado, si existe, lo retornaos
        if (result.length > 0) {
            res.status(200).json({
                mensaje: "OK",
                detalles: result,
            });
        }
        //Si no hay resultado retornamos el error 
        else if ((result.length == 0)) {
            res.status(404).json({
                mensaje: "No existe el registro de salida de almacén con id: " + idSalida + " en la base de datos.",
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

//Proceso de salida de almacén y resta de stock del inventario
exports.addSalida = async (req, res) => {
    //Query para agregar una salida de almacén
    let query = 'INSERT INTO salida set ?';
    let requestBody = {
        descripcion: req.body.salida.descripcion,
        idProducto: req.body.salida.idProducto,
        fechaSalida: req.body.salida.fechaSalida,
        cantidad: req.body.salida.cantidad,
    };

    //Validamos el request con joi
    try {
        await salidaModel.validateAsync(requestBody);
    } catch (error) {
        return res.status(400).json({
            mensaje: "Petición invalida",
            detalles: error['details']
        });
    }

    let fechaSalidaPromocion = req.body.salida.fechaSalida;//Para obtener la fecha de salida de almacén cuando aplique promoción y luego almacenar las tazas que salen por
    //promoción en la tabla de salidas 
    let cantidad = req.body.salida.cantidad;//Obtenemos la cantidad de tazas que salen de almacén para luego restarlas del inventario
    let idTipoTaza = req.body.salida.idTipoTaza;//Obtener el tipo de taza para determinar cuantas se regalarán en caso de que cumpla con los criterios de la promoción

    let tazasRegaladas;//Para almacenar el número de tazas a regalar
    let idProducto = req.body.salida.idProducto;//Para almacenar el ID del producto del inventario para restarle las unidades que salieron de almacén
    let idProductoPromocion;//Para obtener el ID del producto que se pueda regalar en base al que tenga mayor stock
    let stockProductoPromocion;//Para obtener el stock del producto que se puede regalar

    //Se inicia la consulta
    pool.query(query, [requestBody], function (err, result) {
        if (result) {
            //Comprobamos de que exista un resultado, si existe, continuamos con el proceso.

            //Query para modificar el sotck del producto que salió de almacén
            let queryUpdateInventario = 'UPDATE inventario set stock = stock - ? WHERE idProducto = ?';

            //Se inicia la consulta
            pool.query(queryUpdateInventario, [cantidad, idProducto], function (err) {
                //Comprobamos si existe un error, si existe, lo retornaoms.
                if (err) {
                    pool.rollback(() => {
                        console.log(err.message);
                    })
                    return res.status(400).json({
                        mensaje: "Ocurrio un error al modificar el almacén",
                        detalles: err
                    });
                }
                //Si no hay error continuamos con el proceso
            });


            let auxModTazas = Math.trunc((cantidad /= 10));
            if (auxModTazas >= 1) {
                //Comprobamos si son tazas de alta calidad
                if (idTipoTaza == 1) {
                    //Asignamos el número de tazas a regalar
                    tazasRegaladas = 3 * auxModTazas;
                    //Comprobamos si son tazas de baja calidad
                } else if (idTipoTaza == 2) {
                    //Asignamos el número de tazas a regalar
                    tazasRegaladas = 2 * auxModTazas;
                }

                //Query para obtener el ID del producto y el stock de los articulos de baja calidad, ordernados de mayor a menor con base al stock, con limite de 1
                let querySelectInventarioCalidadBaja = "SELECT stock, idProducto FROM inventario WHERE tipoTaza=2 ORDER BY stock DESC LIMIT 1";

                //Se inicia la consulta
                pool.query(querySelectInventarioCalidadBaja, function (err, result) {
                    if (err) {
                        //Comprobamos si existe un error, si existe, lo retornaoms.
                        pool.rollback(() => {
                            console.log(err.message);
                        })
                        return res.status(400).json({
                            mensaje: "Ocurrio un error al modificar el almacén",
                            detalles: err
                        });
                    } else if (result.length == 0) {
                        //Si no hay inventario de tazas de baja calidad retornamos lo siguiente
                        res.status(200).json({
                            mensaje: "OK",
                            detalles: "Salida de almacén registrada correctamente. No se aplicó ninguna promoción debido a falta de stock en tazas de baja calidad",
                        });
                    } else {
                        //Si no hay error continuamos con el proceso
                        stockProductoPromocion = result[0].stock;
                        idProductoPromocion = result[0].idProducto;

                        //Comprobamos que el stock del producto que se regala en la promoción sea mayor a la cantidad de tazas a regalar.
                        if (stockProductoPromocion > tazasRegaladas) {
                            //Query para restar el stock del producto que se regala por la promoción
                            let queryUpdateStockProductoPromocion = "UPDATE inventario SET stock = stock -? WHERE idProducto = ?";

                            //Se inicia la consulta
                            pool.query(queryUpdateStockProductoPromocion, [tazasRegaladas, idProductoPromocion], function (err) {
                                //Comprobamos si existe un error, si existe, lo retornaoms.
                                if (err) {
                                    pool.rollback(() => {
                                        console.log(err.message);
                                    })
                                    return res.status(400).json({
                                        mensaje: "Ocurrio un error al modificar el almacén",
                                        detalles: err
                                    });
                                } else {

                                    let queryAddSalidaPromocion = 'INSERT INTO salida set ?';
                                    let dataQuery = {
                                        descripcion: "Salida por promoción",
                                        idProducto: idProductoPromocion,
                                        fechaSalida: fechaSalidaPromocion,
                                        cantidad: tazasRegaladas,
                                    };

                                    //Se inicia la consulta
                                    pool.query(queryAddSalidaPromocion, [dataQuery], function (err) {
                                        //Comprobamos si existe un error, si existe, lo retornaoms.
                                        if (err) {
                                            pool.rollback(() => {
                                                console.log(err.message);
                                            })
                                            return res.status(400).json({
                                                mensaje: "Ocurrio un error al modificar el almacén",
                                                detalles: err
                                            });
                                        }
                                        else {
                                            //Si no hay error continuamos con el proceso
                                            res.status(200).json({
                                                mensaje: "OK",
                                                detalles: "Salida de almacén registrada correctamente. Se aplicó la promoción con " + tazasRegaladas + " tazas de baja calidad regaladas.",
                                            });
                                        }
                                    });
                                }
                            });
                            //Si el stock del producto que se regala en la promoción es menor a la cantidad de tazas a regalar retornamos lo siguiente.
                        } else {
                            res.status(200).json({
                                mensaje: "OK",
                                detalles: "Salida de almacén registrada correctamente. No se aplicó ninguna promoción debido a falta de stock en tazas de baja calidad",
                            });
                        }
                    }
                });
                //En caso de que no se aplique alguna promoción retornamos lo siguiente
            } else {
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
