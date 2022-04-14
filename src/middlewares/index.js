const validarCampos = require("./validar-campos");
const validarJWT = require("./validar-jwt");

module.exports = {
    ...validarCampos,
    ...validarJWT,
};
