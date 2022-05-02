const { Router } = require('express');

// const {} = require('../controllers/controllers');

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');+

const usersRouter = require('./users.js');
const petsRouter = require('./pets.js');
const caretakers = require('./caretakers');
const authRouter = require('./auth.js');
const operationsRouter = require('./operations.js');
const chatRouter = require('./chats.js');
const messageRouter = require('./messages.js');

const router = Router();

// Ejemplo: router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/pets', petsRouter);
router.use('/caretakers', caretakers);
router.use('/auth', authRouter);
router.use('/operations', operationsRouter);
router.use('/chats', chatRouter);
router.use('/messages', messageRouter);

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

module.exports = router;
