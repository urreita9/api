const { Router } = require('express');
const { getAllOperations } = require('../controllers/controllerOperations')
const { check, validationResult } = require('express-validator');

// Requerimos el middleware de autenticación
//const { authentication, adminAuthentication } = require("../middlewares");

const operationsRouter = Router();

// @route GET api/operations/
// @desc Obtener la información de todas las operaciones de la App en cualquiera de sus estados
// @access Private 

operationsRouter.get('/', async (req, res, next) => {
    //seteo IdOperation para poder usar el mismo controller si busco todas las operaciones o solo una por Id
    let IdOperation = null
    const get = await getAllOperations(IdOperation);
    if (get.error) return next(get.error);

    res.status(200).json(get);
});

// @route GET api/idOperation/:id
// @desc Obtener la info de una operacion por idOperation
// @access Private
operationsRouter.get('/:IdOperation', async (req, res, next) => {
    const { IdOperation } = req.params;

    let get = await getAllOperations(IdOperation);
    if (get.error) return next(get.error);

    res.status(200).json(get);

})




module.exports = operationsRouter;
