const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define(
    'answer',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      answer: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    { logging: false, timestamps: false }
  );
};
