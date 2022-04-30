const { Router } = require('express');
const server = require('../app');
const router = Router();
const {
  validarJWT,
  validarSuperAdminyAdmin,
  validarAdmin,
} = require('../middlewares');
const {
  createOperation,
  captureOrder,
  cancelOrder,
  getOperations,
  getAllOperations,
  editOperation,
} = require('../controllers/operations');

router.get('/', validarJWT, getOperations);
router.get('/all', [validarJWT, validarSuperAdminyAdmin], getAllOperations);
router.put('/', [validarJWT, validarSuperAdminyAdmin], editOperation);
router.post('/create-order', createOperation);
router.get('/capture-order', captureOrder);
router.get('/cancel-order', cancelOrder);
module.exports = router;
