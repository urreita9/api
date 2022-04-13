
const { Router } = require('express');

// const {} = require('../controllers/controllers');

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const operationsRouter = require('./operations.routes')

const router = Router();




// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/operations', operationsRouter)

module.exports = router;
