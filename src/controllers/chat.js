const { response } = require('express');
const { request } = require('express');
const { User, Chat, Message } = require('../db');
const getAllChats = async (req = request, res = response) => {
    const chats = await Chat.findAll({
        include: [
            {
                model: User,
            },
        ],
    });

    res.json(chats);
};

const getChatById = async (req = request, res = response) => {
    const { chatId } = req.params;

    const chat = await Chat.findByPk(chatId, {
        include: [
            {
                model: Message,
            },
        ],
    });

    res.json({
        ok: true,
        chat,
    });
};

const crearChat = async (req = request, res = response) => {
    const { user1, user2 } = req.body;

    const chat = await Chat.create();

    await chat.setUsers([user1, user2]);

    res.json({
        ok: true,
        chat,
    });
};

module.exports = {
    getAllChats,
    getChatById,
    crearChat,
};
