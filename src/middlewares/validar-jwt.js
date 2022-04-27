const { request } = require('express');
const { response } = require('express');
const jwt = require('jsonwebtoken');
const { User, Pet } = require('../db');

const validarJWT = async (req = request, res = response, next) => {
    var token = req.header('x-token');

    if (!token) {
        token = req.query.token
        if(!token){
            return res.status(401).json({ msg: 'No hay token en la peticion' });
        }
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const validUser = await User.findByPk(uid);

        if (!validUser) {
            return res.status(401).json({ msg: 'Token no valido - Usuario no existe' });
        }

        req.validUser = validUser.dataValues;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido',
        });
    }
};

module.exports = {
    validarJWT,
};
