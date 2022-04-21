const { Router } = require('express');
const router = Router();

const {
	createOperation,
	getOperationsById,
	editOperation,
} = require('../controllers/operations');

router.get('/:id', getOperationsById);
router.put('/', editOperation);
router.post('/', createOperation);

module.exports = router;
