const { Router } = require('express');
const { check, body } = require('express-validator');
const { existeUsuarioPorId } = require('../helpers/db-validators');
const {
	validarCampos,
	validarJWT,
	validarPermisos,
	validarPermisosProfile,
} = require('../middlewares');

const {
	getUsers,
	getUser,
	getUserJWT,
	createUser,
	editUser,
	deleteUser,
	checkPassword,
} = require('../controllers/User');

const router = Router();

//OBTENER TODOS LOS USERS
router.get('/', getUsers);

//OBTENER UN USER POR ID
router.get(
	'/:id',
	[
		check('id', 'ID no valido').isUUID(),
		check('id').custom(existeUsuarioPorId),
		validarCampos,
	],
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
		body('password', 'El password tiene que tener mas de 6 letras')
			.if(body('password').exists())
			.isLength({
				min: 6,
			}),
		body('img', 'La img debe ser una URL').if(body('img').exists()).isURL(),
		validarCampos,
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

module.exports = router;
