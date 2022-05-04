const { Router } = require('express');
const { check, body } = require('express-validator');
const { getAllNotifications, createNotification, deleteNotification } = require('../controllers/chatnotification');

const router = Router();

//get All notifications
router.get('/', getAllNotifications);

//Create notification
router.post('/', createNotification);

//Delete Notification
router.delete('/', deleteNotification);

module.exports = router;
