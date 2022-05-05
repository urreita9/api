const { Router } = require('express');
const { bulkAction } = require('../controllers/bulk');

const router = Router();

//Login
router.post('/', bulkAction);

module.exports = router;
