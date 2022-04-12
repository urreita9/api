const { Sequelize, DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    //defino el modelo
    sequelize.define(
        "pet",
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            age: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            race: {
                type: DataTypes.STRING,
                defaultValue: "none",
            },
            size: {
                type: DataTypes.ENUM("small", "medium", "big"),
                allowNull: false,
                defaultValue: "big",
            },
            specialFood: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        { logging: false, timestamps: false }
    );
};
