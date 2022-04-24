const { Router } = require('express');
const router = Router();
const {
	getCaretakers,
	getCaretaker,
	getQuestions,
	postCaretaker,
	postCaretakerQuestion,
	postAnswer,
	editCaretaker,
	deleteCaretaker,
} = require('../controllers/caretaker');
const { transformImage } = require('../middlewares/transformImage');

router.get('/', getCaretakers);
router.get('/:id', getCaretaker);
router.get('/questions/:id', getQuestions);
router.post('/', transformImage, postCaretaker);
router.post('/questions/:id', postCaretakerQuestion);
router.post('/answer/:id', postAnswer);
router.put('/:id', transformImage, editCaretaker);
router.delete('/:id', deleteCaretaker);

module.exports = router;
