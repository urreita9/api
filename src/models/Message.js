const { Sequelize, DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    //defino el modelo
    sequelize.define(
        'message',
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            de: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            para: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            mensaje: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            createAt: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        { logging: false, timestamps: false }
    );
};
