import { Server } from "socket.io";
import { createServer } from 'http';


const httpServer = createServer();
const io = new Server(httpServer,{
    cors:{
        origin:'*',
    },
});

const PORT = 3001;
const HOST = '127.0.0.1';

httpServer.listen(PORT, HOST, () => {
    console.log(`Servidor Socket.IO rodando em http://${HOST}:${PORT}`);
});


const players = {};

const randomPosition = () => {
    return [Math.floor(Math.random() * 6),0,Math.floor(Math.random() * 6)];
};
const randomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

const updatePlayersF = () => {
    io.emit('updatePlayers',players);
};

io.on('connection',(socket)=>{
    console.log('Cliente conectado: ',socket.id);

    players[socket.id] = {
        position:randomPosition(),
        color:randomColor(),
    };

    socket.emit('setup',players[socket.id]);
    updatePlayersF();

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
        delete players[socket.id];
        updatePlayersF();
    });

});