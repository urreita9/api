const { Router } = require('express');
const router = Router();
const {
  getCaretakers,
  getCaretaker,
  postCaretaker,
  postCaretakerQuestion,
} = require('../controllers/caretaker');

router.get('/', getCaretakers);
router.get('/:id', getCaretaker);
router.post('/', postCaretaker);
router.post('/question/:id', postCaretakerQuestion);

module.exports = router;
