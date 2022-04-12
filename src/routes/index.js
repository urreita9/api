const { Router } = require("express");
// const {} = require('../controllers/controllers');

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const usersRouter = require("./users.js");

const router = Router();

// Ejemplo: router.use('/auth', authRouter);
router.use("/users", usersRouter);

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

module.exports = router;
