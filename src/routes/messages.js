const { Router } = require('express');
const { check } = require('express-validator');
const { getAllMessages, crearMessage } = require('../controllers/message');
const {
    validarCampos,
    validarJWT,
    validarPermisos,
    validarPermisosProfile,
    validarSuperAdmin,
    validarSuperAdminyAdmin,
} = require('../middlewares');
const router = Router();

//OBTENER TODOS LOS Mensajes
router.get('/', getAllMessages);

//CREAR UN Mensaje
router.post(
    '/',
    [
        validarJWT,
        check('de', 'El usuario que envia el mensaje es necesario').not().isEmpty(),
        check('de', 'El usuario que envia debe ser un ID').isUUID(),
        check('para', 'El usuario que recibe el mensaje es necesario').not().isEmpty(),
        check('para', 'El usuario que recibe debe ser un ID').isUUID(),
        check('mensaje', 'Se necesita el mensaje').not().isEmpty(),
        check('mensaje', 'El mensaje debe ser un string').isString(),
        check('chatId', 'Se necesita el chat').not().isEmpty(),
        check('chatId', 'El chat debe ser un UUID').isUUID(),
        check('createAt', 'Se necesita la fecha de creacion').not().isEmpty(),
        check('createAt', 'La fecha debe ser un string').isString(),
        validarCampos,
    ],
    crearMessage
);

module.exports = router;
