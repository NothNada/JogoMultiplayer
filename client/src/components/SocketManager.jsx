import { useEffect } from 'react';
import { io } from 'socket.io-client';

export const socket = io('127.0.0.1:3001',{
    autoConnect:false, //Desativo o autoConnect porque está dando problemas de conexão
});

export const SocketManager = ({ handlerSetup, handlerPlayers }) => {
    useEffect(()=>{
        function onConnect(){
            console.log('conectado');
            socket.on('setup',onSetup);
            socket.on('updatePlayers',onUpdatePlayers);
        }
        function onDisconnect(){
            console.log('disconectado');
        }
        function onSetup(data){
            handlerSetup(data);
        }
        function onUpdatePlayers(data){
            console.log(data);
            handlerPlayers(data);
        }


        socket.on('connect',onConnect);
        socket.on('disconnect',onDisconnect);

        socket.connect();
        return ()=>{
            socket.off('connect',onConnect);
            socket.off('disconnect',onDisconnect);
            socket.off('setup',onSetup);
            socket.off('updatePlayers',onUpdatePlayers);
        }

    },[]);

    return null;
};