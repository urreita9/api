const { User, Chat, Message } = require('../db');

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

const crearMensaje = async (de, para, mensaje, createAt, chatId) => {
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

module.exports = {
    usuarioConectado,
    usuarioDesconectado,
    crearMensaje,
};
