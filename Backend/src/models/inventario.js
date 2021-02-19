const Joi = require('joi');

const inventarioModel = Joi.object({
    idProducto:Joi.number(),
    descripcion: Joi.string().max(100).uppercase(),
    tipoTaza: Joi.number().required(),
    color: Joi.string().max(15).trim().required(),
    altura: Joi.number().required(),
    ancho: Joi.number().required(),
    capacidad: Joi.number().required(),
    modelo: Joi.string().max(100).uppercase().required(),
    material: Joi.string().max(100).uppercase().required(),
    stock: Joi.number().required(),
});

