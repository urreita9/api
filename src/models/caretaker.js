const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define(
    'caretaker',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      description: {
        type: DataTypes.TEXT,
        isNull: false,
      },
      rating: {
        type: DataTypes.FLOAT,
        isNull: false,
        min: 1,
        max: 5,
      },
      lat: {
        type: DataTypes.FLOAT,
        isNull: false,
      },
      lng: {
        type: DataTypes.FLOAT,
        isNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        isNull: false,
        min: 0,
      },
      size: {
        type: DataTypes.INTEGER,
        min: 0,
        max: 2,
        isNull: false,
      },
    },
    { logging: false, timestamps: false }
  );
};
