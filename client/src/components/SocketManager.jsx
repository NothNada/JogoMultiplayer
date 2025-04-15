import { useEffect } from "react";
import { io } from "socket.io-client";

export const socket = io("127.0.0.1:3001",{
  autoConnect:false,
});

export const SocketManager = ({ handlerSetup, handlerPlayers, handlerObjects }) => {
  useEffect(() => {
    function onConnect() {
      console.log("connected");
      
      socket.on("setup",onSetup);
      socket.on("updatePlayers",onUpdatePlayers);
      socket.on("updateObjects",onUpdateObjects);
    }

    function onDisconnect() {
      console.log("disconnected");
    }

    function onSetup(data){
      // console.log("Setup:",data);
      handlerSetup(data);
    }

    function onUpdatePlayers(data){
      // console.log("UpdatePlayers:",data);
      handlerPlayers(data);
    }

    function onUpdateObjects(data){
      // console.log("UpdateObjects:",data);
      handlerObjects(data);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.connect();
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("setup",onSetup);
      socket.off("updatePlayers",onUpdatePlayers);
      socket.off("updateObjects",onUpdateObjects);
    };
  }, []);

  return null;
};