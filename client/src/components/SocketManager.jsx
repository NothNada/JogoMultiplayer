import { useEffect } from 'react';
import { io } from 'socket.io-client';

export const socket = io('127.0.0.1:3001',{
    autoConnect:false, //Desativo o autoConnect porque está dando problemas de conexão
});

export const SocketManager = ({ handlerSetup }) => {
    useEffect(()=>{
        function onConnect(){
            console.log('conectado');
            socket.on('setup',OnSetup);
        }
        function onDisconnect(){
            console.log('disconectado');
        }
        function OnSetup(data){
            console.log(data);
            handlerSetup(data);
        }


        socket.on('connect',onConnect);
        socket.on('disconnect',onDisconnect);

        socket.connect();
        return ()=>{
            socket.off('connect',onConnect);
            socket.off('disconnect',onDisconnect);
            socket.off('setup',OnSetup);
        }

    },[]);

    return null;
};