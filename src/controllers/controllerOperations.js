const res = require("express/lib/response");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const { Operations } = require('../db')


async function getAllOperations(idOperation) {
    if (idOperation) {
        try {
            let operationById = await Operations.findByPk(idOperation);
            return operationById

        }catch(error){
            console.log(error);
            return { error: {} };
        }
        
    }else {
        try {
            let allOperations = await Operations.findAll()
            return allOperations
        }catch(error){
            console.log(error)
            return { error: {} }
        }
        
        
    }
}


  

module.exports = {
    getAllOperations
  }

