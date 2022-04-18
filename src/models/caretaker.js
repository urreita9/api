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
        allowNull: false,
      },
      homeDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        // get(){
        //   return this.rating;
        // },
        // set(value) {
        //   const currentRating = (value + this.getDataValue('rating')) / 2;
        //   this.setDataValue('rating', currentRating);
        // },
      },
      lat: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      lng: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        min: 0,
      },
      size: {
        type: DataTypes.INTEGER,
        min: 0,
        max: 2,
        allowNull: false,
      },
    },
    { logging: false, timestamps: false }
  );
};
