const validarCampos = require('./validar-campos');
const validarJWT = require('./validar-jwt');
const validarPermisos = require('./validar-permisos');

//Hola mama

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarPermisos,
};
