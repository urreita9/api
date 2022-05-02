const { response } = require('express');
const { request } = require('express');
const { Message, Chat } = require('../db');

const getAllMessages = async (req = request, res = response) => {
    const mensajes = await Message.findAll();


    res.json({
        ok: true,
        mensajes,
    });
};

const crearMessage = async (req = request, res = response) => {
    const { de, para, mensaje, createAt, chatId } = req.body;
    

    const msg = await Message.create({
        de,
        para,
        mensaje,
        createAt,
        chatId,
    });

    res.json({
        ok: true,
        msg,
    });
};

module.exports = {
    getAllMessages,
    crearMessage,
};
