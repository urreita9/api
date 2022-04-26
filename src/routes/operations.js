const { Router } = require('express');
const server = require('../app');
const router = Router();
const { validarJWT } = require('../middlewares');
const {
  createOperation,
  captureOrder,
  cancelOrder,
  getUserOperations,
  editOperation,
} = require('../controllers/operations');

router.get('/', validarJWT, getUserOperations);
// router.put("/", editOperation);
router.post('/create-order', createOperation);
router.get('/capture-order', captureOrder);
router.get('/cancel-order', cancelOrder);
module.exports = router;
