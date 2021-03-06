const { User, Chat, Message, Chatnotification } = require('../db');

const usuarioConectado = async (uid) => {
    const usuario = await User.findByPk(uid);
    await usuario.update({ online: true });

    return usuario;
};

const usuarioDesconectado = async (uid) => {
    const usuario = await User.findByPk(uid);
    await usuario.update({ online: false });

    return usuario;
};

const crearMensaje = async ({ de, para, mensaje, createAt, chatId }) => {
    try {
        const msg = await Message.create({
            de,
            para,
            mensaje,
            createAt,
            chatId,
        });

        return msg;
    } catch (error) {
        console.log(error);
        return false;
    }
};

const getAllChatsIO = async (id) => {
    try {
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Chat,
                    attributes: { exclude: ['User-Chats'] },
                    through: {
                        attributes: [],
                    },
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name', 'lastname', 'img', 'online'],
                            through: {
                                attributes: [],
                            },
                        },
                        {
                            model: Chatnotification,
                        },
                    ],
                },
            ],
        });

        const usuario = JSON.parse(JSON.stringify(user));

        const chats = usuario.chats;

        const chatsFinal = chats.map((el) => {
            var user2 = {};
            el.users.forEach((user) => {
                if (user.id !== usuario.id) {
                    user2 = user;
                }
            });

            return {
                chatId: el.id,
                user2,
                notifications: el.chatnotifications,
            };
        });

        return chatsFinal;
    } catch (error) {
        console.log(error);
        return false;
    }
};

const createNotificationIO = async ({ para, chatId }) => {
    try {
        const notificacion = await Chatnotification.create({
            userId: para,
            chatId,
        });

        return notificacion;
    } catch (error) {
        console.log(error);
        return false;
    }
};

const borrarNotificacionesIO = async (userId, chatId) => {
    try {
        await Chatnotification.destroy({
            where: {
                chatId,
                userId,
            },
        });

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

module.exports = {
    usuarioConectado,
    usuarioDesconectado,
    crearMensaje,
    getAllChatsIO,
    createNotificationIO,
    borrarNotificacionesIO,
};
