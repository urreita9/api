const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define(
    'image',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      img: {
        type: DataTypes.STRING(1000),
      },
    },
    { logging: false, timestamps: false }
  );
};
