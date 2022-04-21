const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
	sequelize.define(
		'operation',
		{
			id: {
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
			},
			price: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			timeLapse: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			status: {
				type: DataTypes.ENUM('pending', 'approved', 'disapproved', 'paid'),
				allowNull: false,
				defaultValue: 'pending',
			},
		},
		{ logging: false, timestamps: false }
	);
};
