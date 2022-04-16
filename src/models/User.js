const { Sequelize, DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  //defino el modelo
  sequelize.define(
    'user',
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
      },
      lastname: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      points: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      role: {
        type: DataTypes.ENUM('USER', 'ADMIN'),
        defaultValue: 'USER',
      },
      img: {
        type: DataTypes.STRING,
      },
    },
    { logging: false, timestamps: false }
  );
};
