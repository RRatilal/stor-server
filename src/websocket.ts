import { Server } from 'http';
import { Socket} from 'socket.io';

const setupWebsocket = (server: Server) => {
    const io = require("socket.io")(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
          }
    });
    
    io.on('connection', (socket: Socket) => {
        socket.emit('me', socket.id);

        socket.on('disconnect', () => {
            socket.broadcast.emit("Callended")
        });

        socket.on('calluser', ({userToCall, signalData, from, name}) => {
            io.to(userToCall).emit('calluser', { signal: signalData, from, name });
        });

        socket.on('answercall', (data) => {
            io.to(data.to).emit('callaccepted', data.signal);
        });
    })
}

export default setupWebsocket;