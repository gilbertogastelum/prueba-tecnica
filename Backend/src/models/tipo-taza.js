const Joi = require('joi');

const tipoTazaModel = Joi.object({
    idTipoTaza:Joi.number(),
    descripcion: Joi.string().max(100).required(),
}).options({abortEarly : false});


module.exports={
    tipoTazaModel
};
