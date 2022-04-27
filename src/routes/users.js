const { Router } = require('express');
const { check, body } = require('express-validator');
const { existeUsuarioPorId } = require('../helpers/db-validators');
const {
    validarCampos,
    validarJWT,
    validarPermisos,
    validarPermisosProfile,
    validarSuperAdmin,
    validarSuperAdminyAdmin,
} = require('../middlewares');
const { transformImage, transformImageOne } = require('../middlewares/transformImage');

const {
    getUsers,
    getUser,
    getUserJWT,
    createUser,
    editUser,
    deleteUser,
    checkPassword,
    createSuperAdmin,
    beAdmin,
    beUser,
    banUser,
    unBanUser,
    createAdmin,
    getUsersAdmin,
} = require('../controllers/User');

const router = Router();

//OBTENER TODOS LOS USERS
router.get('/', getUsers);

//OBTENER UN USER POR ID
router.get(
    '/:id',
    [check('id', 'ID no valido').isUUID(), check('id').custom(existeUsuarioPorId), validarCampos],
    getUser
);

//OBTENER UN USER POR ID
router.get(
    '/userjwt/jwt',
    [
        validarJWT,
        check('uid', 'ID no valido').isUUID(),
        check('uid').custom(existeUsuarioPorId),
        validarCampos,
        validarPermisosProfile,
        validarCampos,
    ],
    getUserJWT
);

//CREAR UN USER
router.post(
    '/',
    [
        check('name', 'Debe tener un nombre').not().isEmpty(),
        check('lastname', 'Debe tener un apellido').not().isEmpty(),
        check('email', 'El email es obligatorio').not().isEmpty(),
        check('email', 'El email no es valido').isEmail(),
        check('password', 'La constraseña es obligatoria').not().isEmpty(),
        check('password', 'El password tiene que tener mas de 6 letras').isLength({
            min: 6,
        }),
        validarCampos,
    ],
    createUser
);

//EDITAR UN USER
router.put(
    '/:id',
    [
        validarJWT,
        check('id', 'ID no valido').isUUID(),
        check('id').custom(existeUsuarioPorId),
        validarCampos,
        validarPermisos,
        body('password', 'El password tiene que tener mas de 6 letras').if(body('password').exists()).isLength({
            min: 6,
        }),
        body('img', 'La img debe ser una URL').if(body('img').exists()).isString(),
        validarCampos,
        transformImageOne,
    ],
    editUser
);

//BORRAR UN USER
router.delete(
    '/:id',
    [
        validarJWT,
        check('id', 'ID no valido').isUUID(),
        check('id').custom(existeUsuarioPorId),
        validarCampos,
        validarPermisos,
        validarCampos,
    ],
    deleteUser
);

router.post(
    '/check/password',
    [
        validarJWT,
        check('uid', 'ID no valido').isUUID(),
        check('uid').custom(existeUsuarioPorId),
        validarCampos,
        validarPermisosProfile,
        check('password', 'Se necesita contraseña').not().isEmpty(),
        validarCampos,
    ],
    checkPassword
);

router.post(
    '/create/superadmin',
    [
        check('name', 'Debe tener un nombre').not().isEmpty(),
        check('lastname', 'Debe tener un apellido').not().isEmpty(),
        check('email', 'El email es obligatorio').not().isEmpty(),
        check('email', 'El email no es valido').isEmail(),
        check('password', 'La constraseña es obligatoria').not().isEmpty(),
        check('password', 'El password tiene que tener mas de 6 letras').isLength({
            min: 6,
        }),
        validarCampos,
    ],
    createSuperAdmin
);

router.post(
    '/create/admin',
    [
        validarJWT,
        validarSuperAdmin,
        check('name', 'Debe tener un nombre').not().isEmpty(),
        check('lastname', 'Debe tener un apellido').not().isEmpty(),
        check('email', 'El email es obligatorio').not().isEmpty(),
        check('email', 'El email no es valido').isEmail(),
        check('password', 'La constraseña es obligatoria').not().isEmpty(),
        check('password', 'El password tiene que tener mas de 6 letras').isLength({
            min: 6,
        }),
        validarCampos,
    ],
    createAdmin
);
router.put(
    '/edit/beadmin',
    [
        validarJWT,
        validarSuperAdmin,
        check('userId', 'ID no valido').isUUID(),
        check('userId').custom(existeUsuarioPorId),
        validarCampos,
    ],
    beAdmin
);
router.put(
    '/edit/beuser',
    [
        validarJWT,
        validarSuperAdmin,
        check('userId', 'ID no valido').isUUID(),
        check('userId').custom(existeUsuarioPorId),
        validarCampos,
    ],
    beUser
);
router.put(
    '/edit/banuser',
    [
        validarJWT,
        validarSuperAdminyAdmin,
        check('userId', 'ID no valido').isUUID(),
        check('userId').custom(existeUsuarioPorId),
        validarCampos,
    ],
    banUser
);
router.put(
    '/edit/unbanuser',
    [
        validarJWT,
        validarSuperAdminyAdmin,
        check('userId', 'ID no valido').isUUID(),
        check('userId').custom(existeUsuarioPorId),
        validarCampos,
    ],
    unBanUser
);

router.get('/admin/users', [validarJWT, validarSuperAdminyAdmin], getUsersAdmin);

module.exports = router;
