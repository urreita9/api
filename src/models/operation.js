const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  sequelize.define(
    'operation',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      timeLapse: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('COMPLETED', 'APPROVED', 'CREATED', 'CANCELED'),
        allowNull: false,
        defaultValue: 'CREATED',
      },
      caretakerId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      operationId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      petId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dispatch: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      petReceived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      petDelivered: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    },
    { logging: false }
  );
};
