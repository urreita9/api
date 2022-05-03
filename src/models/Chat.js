const { Sequelize, DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	//defino el modelo
	sequelize.define(
		'chat',
		{
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
			},
			// caretakerId: {
			// 	type: Sequelize.toString,
			// 	allowNull: false,
			// },
		},
		{ logging: false, timestamps: false }
	);
};
