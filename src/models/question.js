const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define(
    'question',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      question: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      questioner: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      answered: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    { logging: false, timestamps: false }
  );
};
