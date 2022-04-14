const { Router } = require('express');

// const {} = require('../controllers/controllers');

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');+

const usersRouter = require('./users.js');
const petsRouter = require('./pets.js');
const caretaker = require('./caretaker');

const router = Router();

// Ejemplo: router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/pets', petsRouter);
router.use('/caretaker', caretaker);

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

module.exports = router;
