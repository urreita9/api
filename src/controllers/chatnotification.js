const { User, Chat, Message, Chatnotification } = require('../db');

const getAllNotifications = async (req = request, res = response) => {
    const notifications = await Chatnotification.findAll({
        include: [
            {
                model: User,
                attributes: ['id', 'name'],
            },
            {
                model: Chat,
            },
        ],
    });

    res.json({ ok: true, notifications });
};

const createNotification = async (req = request, res = response) => {
    const { userId, chatId } = req.body;
    const notification = await Chatnotification.create({
        userId,
        chatId,
    });

    res.json({ ok: true, notification });
};

const deleteNotification = async (req = request, res = response) => {
    const { notificationId } = req.body;
    const notification = await Chatnotification.findByPk(notificationId);

    res.json({ ok: true, notification });
};

module.exports = {
    getAllNotifications,
    createNotification,
    deleteNotification,
};
