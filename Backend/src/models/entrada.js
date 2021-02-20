const Joi = require('joi');


const entradaModel = Joi.object({
    idEntrada:Joi.number(),
    descripcion: Joi.string().max(100).required(),
    idProducto: Joi.number().required(),
    fechaEntrada: Joi.date().required(),
    cantidad: Joi.number().required(),
}).options({abortEarly : false});


module.exports={
    entradaModel
};
