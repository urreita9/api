const { request } = require("express");
const { response } = require("express");

const sizeValidator = async (size = "", { req = request, res = response }) => {
    const sizes = ["SMALL", "MEDIUM", "BIG"];

    if (!sizes.includes(size.toUpperCase())) {
        throw new Error(`El tamaño ${size} no existe, los valores permitidos son ${sizes}`);
    }
};

module.exports = {
    sizeValidator,
};
