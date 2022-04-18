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
const { transformImage } = require('../middlewares/transformImage');

router.get('/', getCaretakers);
router.get('/:id', getCaretaker);
router.post('/', transformImage, postCaretaker);
router.post('/question/:id', postCaretakerQuestion);
router.put('/:id', editCaretaker);
router.delete('/:id', deleteCaretaker);

module.exports = router;
