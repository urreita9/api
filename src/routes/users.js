const { Router } = require('express');
const { check, body } = require('express-validator');
const { existeUsuarioPorId } = require('../helpers/db-validators');
const {
  validarCampos,
  validarJWT,
  validarPermisos,
} = require('../middlewares');
const {
  getUsers,
  getUser,
  createUser,
  editUser,
  deleteUser,
} = require('../controllers/User');
const { transformImage } = require('../middlewares/transformImage');

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

//CREAR UN USER
router.post(
  '/',
  [
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
    validarPermisos,
    body('password', 'El password tiene que tener mas de 6 letras')
      .if(body('password').exists())
      .isLength({
        min: 6,
      }),
    validarCampos,
    transformImage,
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
    validarPermisos,
    validarCampos,
  ],
  deleteUser
);

module.exports = router;
