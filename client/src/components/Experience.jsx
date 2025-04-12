import { Box } from '@react-three/drei';
import { useState } from "react";
import { SocketManager } from './SocketManager';

export default function Experience(){

    const [players,setPlayers] = useState();

    function handlerSetup(data){
        
    }

    return (
        <>
            <SocketManager handlerSetup={handlerSetup}/>
            <ambientLight intensity={0.5} />
            <directionalLight position={[-10, 10, 0]} intensity={2} />

        </>
    )
}