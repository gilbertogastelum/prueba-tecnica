const pool = require("../database");
const {inventarioModel} = require('../models/inventario');



//Obtener el listado de todos los productos en el inventario con la descripción del tipo de taza
exports.getProductos = function (req, res) {
    //Query para obtener el listado de todos los productos con su descripción de tipo de taza
    let query = 'SELECT  inventario.idProducto, inventario.descripcion,  inventario.color, inventario.altura, inventario.ancho, inventario.capacidad, inventario.modelo,inventario.material ,inventario.stock, tipo_taza.descripcion as tipoTaza from inventario INNER JOIN tipo_taza ON inventario.tipoTaza= tipo_taza.idTipoTaza';
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

//Obtener el listado de todos los productos en inventario
exports.geInventarioCompleto = function (req, res) {
    //Query para obtener el listado de todos los productos
    let query = 'SELECT  *FROM inventario';
    pool.query(query, function (err, result) {
        //Comprobamos de que exista un resultado, si existe, lo retornamos
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

//Obtener un producto del inventario por id
exports.getProductoById = function (req, res) {
    //Obteneos el ID del producto
    const {idProducto} = req.params;
    console.log(req.params)

    let query = 'SELECT *FROM inventario WHERE idProducto=?';

    pool.query(query,[idProducto] ,function (err, result) {
        //Comprobamos de que exista un resultado, si existe, lo retornamos
        if (result.length > 0) {
            res.status(200).json({
                mensaje: "OK",
                detalles: result,
            });
        } 
        //Si no hay resultado retornamos el error
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

//Añadir un producto al inventario
exports.addProducto =async (req,res)=>{

    let query = 'INSERT INTO inventario set ?';
    let requestBody = {
        descripcion: req.body.producto.descripcion,
        tipoTaza   : req.body.producto.tipoTaza,
        color      : req.body.producto.color,
        altura     : req.body.producto.altura,
        ancho      : req.body.producto.ancho,
        capacidad  : req.body.producto.capacidad,
        modelo     : req.body.producto.modelo,
        material   : req.body.producto.material,
        stock      : 0,
    };

    //Validamos el request con joi
    try{
        await inventarioModel.validateAsync(requestBody);
    }catch(error){
        return res.status(400).json({
            mensaje:"Petición invalida",
            detalles:error['details']
        });
    }

    //Se inicia la consulta
    pool.query(query,[requestBody] ,function (err, result) {
        //Comprobamos de que exista un resultado, si existe, lo retornamos
        if (result) {
            res.status(200).json({
                mensaje: "OK",
                detalles: "Producto agregado correctamente al inventario.",
            });
        } else {
            //Si no hay resultado retornamos el error
            res.status(400).json({
                mensaje: "Ocurrio un error al registrar el producto.",
                detalles: err
            });
        }
    });
}

//Modificar un producto del inventario
exports.editProducto =async (req,res)=>{
    //Obteneos el ID del producto que queremos modificar
    const {idProducto} = req.params;
    let requestBody = {
        descripcion: req.body.producto.descripcion,
        tipoTaza   : req.body.producto.tipoTaza,
        color      : req.body.producto.color,
        altura     : req.body.producto.altura,
        ancho      : req.body.producto.ancho,
        capacidad  : req.body.producto.capacidad,
        modelo     : req.body.producto.modelo,
        material   : req.body.producto.material,
        stock      : req.body.producto.stock,
    };

    //Validamos el request con joi
    try{
        await inventarioModel.validateAsync(requestBody);
    }catch(error){
        return res.status(400).json({
            mensaje:"Petición invalida",
            detalles:error['details']
        });
    }

    //Query para modificar un producto del inventario
    let query = 'UPDATE inventario SET ? where idProducto=?';
    
    //Se inicia la consulta
    pool.query(query,[requestBody,idProducto] ,function (err, result) {
        if (result) {
            //Comprobamos de que exista un resultado, si existe, lo retornamos
            console.log(result);
            console.log(result.lenght);
            res.status(200).json({
                mensaje: "OK",
                detalles: "Se modificó correctamente el producto con id: "+idProducto,
            });
        } else {
            //Si no hay resultado retornamos el error
            res.status(400).json({
                mensaje: "Ocurrio un error al registrar.",
                detalles: err
            });
        }
    });
}

//Eliminar un producto del inventario
exports.deleteProducto = function (req, res) {
    //Obteneos el ID del producto que queremos eliminar
    const {idProducto} = req.params;
    //Query para eliminar un producto del inventario
    let query = 'DELETE FROM inventario WHERE idProducto = ?';

    //Se inicia la consulta
    pool.query(query,[idProducto] ,function (err, result) {
        if (result) {
            //Comprobamos de que exista un resultado, si existe, lo retornamos
            console.log(result);
            console.log(result.lenght);
            res.status(200).json({
                mensaje: "OK",
                detalles: "Se eliminó el producto con id: "+idProducto,
            });
        } else {
            //Si no hay resultado retornamos el error
            res.status(400).json({
                mensaje: "Ocurrio un error al eliminar el prodcuto.",
                detalles: err
            });
        }
    });
}