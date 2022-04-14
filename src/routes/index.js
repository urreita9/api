const { Router } = require('express');
const caretaker = require('./caretaker');

const router = Router();

router.use('/caretaker', caretaker);

module.exports = router;
