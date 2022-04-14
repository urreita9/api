const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
// module.exports = (sequelize) => {
// defino el modelo
// 	sequelize.define(
// 		'user',
// 		{
// 			id: {
// 				type: DataTypes.UUID,
// 				defaultValue: DataTypes.UUIDV4,
// 				primaryKey: true,
// 			},
// 			name: {
// 				type: DataTypes.STRING,
// 				allowNull: false,
// 				isUnique: true,
// 			},

// 		},
// 		{ logging: false, timestamps: false }
// 	);
// };
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
        type: DataTypes.NUMBER,
        isNull: false,
        min: 0,
      },
      size: {
        type: DataTypes.NUMBER,
        min: 0,
        max: 2,
        isNull: false,
      },
    },
    { logging: false, timestamps: false }
  );
};
