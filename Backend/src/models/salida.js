const Joi = require('joi');

const salidaModel = Joi.object({
    idSalida:Joi.number(),
    descripcion: Joi.string().max(100).required(),
    idProducto: Joi.number().required(),
    fechaSalida: Joi.date().required(),
    cantidad: Joi.number().required(),
}).options({abortEarly : false});


module.exports={
    salidaModel
};
