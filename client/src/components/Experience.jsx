import { Box, OrbitControls } from '@react-three/drei';
import { useState } from "react";
import { SocketManager } from './SocketManager';

export default function Experience(){

    const [players,setPlayers] = useState();

    function handlerSetup(data){
        setPlayers(data);
    }

    function handlerPlayers(data){
        setPlayers(data);
    }
    
    return (
        <>
            <SocketManager handlerSetup={handlerSetup} handlerPlayers={handlerPlayers}/>
            <ambientLight intensity={0.5} />
            <directionalLight position={[-10, 10, 0]} intensity={2} />
            <OrbitControls/>
            {
                (players) && Object.entries(players).map((element,i)=>(
                    <Box key={i} position={element[1].position} args={[1, 1, 1]}>
                        <meshStandardMaterial color={element[1].color} />
                    </Box>
                ))
            }

        </>
    )
}