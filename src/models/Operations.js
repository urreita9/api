const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("operations", {
    IdOperation: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      
    },
    Price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    
    },
    Status: {
        type: DataTypes.ENUM("PENDING", "COMPLETED", "CANCELLED"),
        allowNull: false,
        defaultValue: "PENDING"
      },
    // idUser: {
    //   type: DataTypes.UUID,
    //   allowNull: false,
    // },
    // idCuidador: {
    //     type: DataTypes.UUID,
    //     allowNull: false,
    //   },
    //   idPets: {
    //     type: DataTypes.UUID,
    //     allowNull: false,
        
    //   },
    
  });
};
