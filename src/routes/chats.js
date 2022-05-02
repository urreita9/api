const { Router } = require('express');
const { check } = require('express-validator');
const { getAllChats, getChatById, crearChat } = require('../controllers/chat');
const {
    validarCampos,
    validarJWT,
    validarPermisos,
    validarPermisosProfile,
    validarSuperAdmin,
    validarSuperAdminyAdmin,
} = require('../middlewares');

const router = Router();

//OBTENER TODOS LOS Chats
router.get('/', getAllChats);

//OBTENER UN Chat POR ID
router.get('/:chatId', [validarJWT], getChatById);

//CREAR UN Chat
router.post(
    '/',
    [
        validarJWT,
        check('user1', 'Se necesita un user1').not().isEmpty(),
        check('user1', 'El user1 debe ser un UUID').isUUID(),
        check('user2', 'Se necesita un user2').not().isEmpty(),
        check('user2', 'El user2 debe ser un UUID').isUUID(),
        validarCampos,
    ],
    crearChat
);

module.exports = router;
