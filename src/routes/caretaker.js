const { Router } = require('express');
const router = Router();
const {
  caretaker_id_get,
  caretaker_question_post,
} = require('../controllers/caretaker');

router.get('/:id', caretaker_id_get);
router.post('/:id', caretaker_question_post);

module.exports = router;
