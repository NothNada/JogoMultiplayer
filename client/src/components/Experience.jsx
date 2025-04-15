import { Box, OrbitControls } from '@react-three/drei';
import { useRef, useState } from "react";
import { SocketManager } from './SocketManager';
import Player from './Player';

export default function Experience(){

    const [players,setPlayers] = useState();
    const [player,setPlayer] = useState();
    const playerRef = useRef();

    function handlerSetup(data){
        setPlayer(data);
        playerRef.current = data;
    }

    function handlerPlayers(data){
        
        if(playerRef.current){
            Object.entries(data).forEach((element)=>{
                if (element[0] === playerRef.current.id){
                    
                    delete data[element[0]];
                }
            });
        }
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

            { (player) && <Player player={player}/> }

        </>
    )
}