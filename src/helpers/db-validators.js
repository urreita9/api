const { User, Pet } = require('../db');

const existeUsuarioPorId = async (id = '') => {
    console.log(id);
    const existeUsuario = await User.findByPk(id);
    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe`);
    }
};

const existePetPorId = async (id = '') => {
    const existePet = await Pet.findByPk(id);
    if (!existePet) {
        throw new Error(`El id ${id} no existe`);
    }
};

module.exports = {
    existeUsuarioPorId,
    existePetPorId,
};
