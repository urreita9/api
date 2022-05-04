const {
    usuarioConectado,
    usuarioDesconectado,
    crearMensaje,
    getAllChatsIO,
    createNotificationIO,
    borrarNotificacionesIO,
} = require('../controllers/sockets');
const { comprobarJWT } = require('../helpers/generar-jwt');

class Sockets {
    constructor(io) {
        this.io = io;

        this.socketEvents();
    }
    socketEvents() {
        this.io.on('connection', async (socket) => {
            const token = socket.handshake.query['x-token'];
            //Comprobar autentificacion
            const [ok, uid] = await comprobarJWT(token);

            if (!ok) {
                console.log('Socket no identificado');
                return socket.disconnect();
            }

            await usuarioConectado(uid);

            console.log('Usuario conectado');

            socket.join(uid);

            const chats = await getAllChatsIO(uid);

            socket.emit('chats', chats);

            const usersParaActualizar = chats.map((el) => el.user2.id);

            usersParaActualizar.forEach(async (id) => {
                this.io.to(id).emit('actualizate-perro', await getAllChatsIO(id));
            });

            socket.on('personal-message', async (payload) => {
                const mensaje = await crearMensaje(payload);
                const notificacion = await createNotificationIO(payload);
                this.io.to(payload.para).emit('personal-message', mensaje);
                this.io.to(payload.de).emit('personal-message', mensaje);
                this.io.to(payload.para).emit('nueva-notificacion', notificacion);
            });

            socket.on('borrar-notificaciones', async ({ userId, chatId }, callback) => {
                
                if (userId && chatId) {
                    const checkBorrar = borrarNotificacionesIO(userId, chatId);
                    callback(checkBorrar);
                }
            });
            //Desconecion del socket
            socket.on('disconnect', async () => {
                console.log('disconnect');
                await usuarioDesconectado(uid);
                usersParaActualizar.forEach(async (el) => {
                    this.io.to(el).emit('actualizate-perro', await getAllChatsIO(el));
                });
            });
        });
    }
}

module.exports = Sockets;
