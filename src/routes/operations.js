const { Router } = require('express');
const router = Router();

const {
	createOperation,
	getOperations,
	editOperation,
} = require('../controllers/operations');

router.get('/:id', getOperations);
router.put('/', editOperation);
router.post('/', createOperation);

module.exports = router;
