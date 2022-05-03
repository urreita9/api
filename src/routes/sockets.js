const { usuarioConectado, usuarioDesconectado, crearMensaje, getAllChatsIO } = require('../controllers/sockets');
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

            socket.emit('chats', await getAllChatsIO(uid));

            //Conectar a sala
            socket.join(uid);

            socket.on('mensaje-personal', async (payload) => {
                const mensaje = await crearMensaje(payload);
                this.io.to(payload.para).emit('mensaje-personal', mensaje);
                this.io.to(payload.de).emit('mensaje-personal', mensaje);
            });

            //Desconecion del socket
            socket.on('disconnect', async () => {
                console.log('disconnect');
                await usuarioDesconectado(uid);
            });
        });
    }
}

module.exports = Sockets;
