const { request } = require('express');
const { response } = require('express');

const { User, Pet } = require('../db');

const validarPermisos = async (req = request, res = response, next) => {
    const validUser = req.validUser;
    const id = req.params.id;

    const user = await User.findByPk(id);

    if (validUser.id !== user.id) {
        return res.status(400).json({ msg: 'No coinciden ID token con ID que se intenta usar' });
    }

    next();
};

const validarPermisosProfile = async (req = request, res = response, next) => {
    const validUser = req.validUser;
    const id = req.header('uid');

    const user = await User.findByPk(id);

    if (validUser.id !== user.id) {
        return res.status(400).json({ msg: 'No coinciden ID token con ID que se intenta usar' });
    }

    next();
};

const validarPermisosDueño = async (req = request, res = response, next) => {
    const validUser = req.validUser;
    var id = req.body.userId;
    const idPet = req.params.id;

    if (!id) {
        const pet = await Pet.findByPk(idPet);
        id = pet.userId;
    }

    const user = await User.findByPk(id);

    if (validUser.id !== user.id) {
        return res.status(400).json({ msg: 'No coinciden ID token con ID que se intenta usar' });
    }

    next();
};

const validarAdmin = async (role1, role2, { req = request, res = response, next }) => {
    const validUser = req.validUser;

    if (validUser.role === 'ADMIN') {
        next();
    } else {
        res.status(401).json({ state: false, msg: 'No posee los permisos necesarios' });
    }
};

const validarSuperAdmin = async (req = request, res = response, next) => {
    const validUser = req.validUser;

    if (validUser.role === 'SUPER_ADMIN') {
        next();
    } else {
        res.status(401).json({ state: false, msg: 'No posee los permisos necesarios' });
    }
};

const validarSuperAdminyAdmin = async (req = request, res = response, next) => {
    const validUser = req.validUser;

    if (validUser.role === 'SUPER_ADMIN' || validUser.role === 'ADMIN') {
        next();
    } else {
        res.status(401).json({ state: false, msg: 'No posee los permisos necesarios' });
    }
};

module.exports = {
    validarPermisos,
    validarPermisosDueño,
    validarPermisosProfile,
    validarAdmin,
    validarSuperAdmin,
    validarSuperAdminyAdmin,
};
