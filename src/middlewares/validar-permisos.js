const { request } = require("express");
const { response } = require("express");

const { User, Pet } = require("../db");

const validarPermisos = async (req = request, res = response, next) => {
    const validUser = req.validUser;
    const id = req.params.id;

    const user = await User.findByPk(id);

    if (validUser.id !== user.id) {
        return res.status(400).json({ msg: "No coinciden ID token con ID que se intenta usar" });
    }

    next();
};

module.exports = {
    validarPermisos,
};
