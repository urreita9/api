const { User, Pet } = require("../db");

// const emailExiste = async (correo = "") => {
//     const existeEmail = await Usuario.findOne({ correo });
//     if (existeEmail) {
//         throw new Error("El correo ya esta registrado");
//     }
// };

const existeUsuarioPorId = async (id = "") => {
    const existeUsuario = await User.findByPk(id);
    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe`);
    }
};

const existePetPorId = async (id = "") => {
    const existePet = await Pet.findByPk(id);
    if (!existePet) {
        throw new Error(`El id ${id} no existe`);
    }
};

module.exports = {
    existeUsuarioPorId,
    existePetPorId,
};
