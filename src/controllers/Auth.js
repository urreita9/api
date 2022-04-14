const { response } = require("express");
const { request } = require("express");
const { User, Pet } = require("../db");
const { generarJWT } = require("../helpers/generar-jwt");
const bcryptjs = require("bcryptjs");

const login = async (req = request, res = response) => {
    const { email, password } = req.body;

    try {
        //Verificar si el email existe
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ msg: "Usuario / Password incorrecto - correo" });
        }
        //Verificar contraseña
        const validPassword = await bcryptjs.compare(password, user.password);

        console.log(validPassword);
        
        if (!validPassword) {
            return res.status(400).json({ msg: "Usuario / Password incorrecto - password" });
        }

        // Generar JWT
        const token = await generarJWT(user.id);

        res.json({ user, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Ocurrio un error",
        });
    }
};

module.exports = {
    login,
};
