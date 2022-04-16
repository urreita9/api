const { Router } = require('express');
const router = Router();
const {
  getCaretakers,
  getCaretaker,
  postCaretaker,
  postCaretakerQuestion,
  editCaretaker,
  deleteCaretaker,
} = require('../controllers/caretaker');

router.get('/', getCaretakers);
router.get('/:id', getCaretaker);
router.post('/', postCaretaker);
router.post('/question/:id', postCaretakerQuestion);
router.put('/:id', editCaretaker);
router.delete('/:id', deleteCaretaker);

module.exports = router;
