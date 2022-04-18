const { Router } = require('express');
const { check, body } = require('express-validator');
const { existeUsuarioPorId, existePetPorId } = require('../helpers/db-validators');
const { validarCampos, validarJWT, validarPermisos, validarPermisosDueño } = require('../middlewares');
const { getPets, getPet, createPet, editPet, deletePet } = require('../controllers/Pet');
const { sizeValidator } = require('../helpers/validar-pet');

const router = Router();

//OBTENER TODOS LOS Pets
router.get('/', getPets);

//OBTENER UN PET POR ID
router.get('/:id', [check('id', 'ID no valido').isUUID(), check('id').custom(existePetPorId), validarCampos], getPet);

//CREAR UN PET
router.post(
    '/',
    [
        validarJWT,
        check('name', 'Debe tener un nombre').notEmpty(),
        check('userId', 'Debe tener un usuario').notEmpty(),
        check('userId', 'Debe tener un usuario').isUUID(),
        check('userId').custom(existeUsuarioPorId),
        validarCampos,
        validarPermisosDueño,
        body('age', 'Debe ser un entero menor a 25 años').if(body('age').exists()).isInt({ gt: 0, lt: 26 }),
        body('size', 'No existe ese tamaño').if(body('size').exists()).custom(sizeValidator),
        body('race', 'La raza debe ser un string').if(body('race').exists()).isString(),
        body('specialFood', 'Solo se aceptan valores booleanos para specialFood')
            .if(body('specialFood').exists())
            .isBoolean(),
        validarCampos,
    ],
    createPet
);

//EDITAR UN PET
router.put(
    '/:id',
    [
        validarJWT,
        check('id', 'ID no valido').isUUID(),
        check('id').custom(existePetPorId),
        validarCampos,
        validarPermisosDueño,
        body('age', 'Debe ser un entero menor a 25 años').if(body('age').exists()).isInt({ gt: 0, lt: 26 }),
        body('size', 'No existe ese tamaño').if(body('size').exists()).custom(sizeValidator),
        body('race', 'La raza debe ser un string').if(body('race').exists()).isString(),
        body('specialFood', 'Solo se aceptan valores booleanos para specialFood')
            .if(body('specialFood').exists())
            .isBoolean(),
        validarCampos,
    ],
    editPet
);

//BORRAR UN PET
router.delete(
    '/:id',
    [
        validarJWT,
        check('id', 'ID no valido').isUUID(),
        check('id').custom(existePetPorId),
        validarCampos,
        validarPermisosDueño,
        validarCampos,
    ],
    deletePet
);

module.exports = router;
