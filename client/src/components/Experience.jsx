import { Box } from '@react-three/drei'
import { SocketManager, socket } from './SocketManager'
import { useEffect, useRef, useState } from 'react';
import { useKeyboardControls } from './useKeyboardControls';
import Player from './Player';

export default function Experience() {

  const [player,setPlayer] = useState();
  const [players,setPlayers] = useState();
  const [objects,setObjects] = useState();
  const playerRef = useRef();

  const movement = useKeyboardControls();

  const handlerSetup = (data) => {
    // console.log(data);
    setPlayer(data);
    playerRef.current = data;
  };

  const handlerPlayers = (data) => {
    if(playerRef.current){
      Object.entries(data).forEach(([key, value])=>{
        if (key === playerRef.current.id){
          setPlayer(data[key]);
          delete data[key];
        }
        
      });
    }
    setPlayers(data);
    
  };

  const handlerObjects = (data) => {
    setObjects(data);
  };

  useEffect(() => {
    
    if (player) {
      socket.emit('move', movement);
      // console.log(movement);
    }
  }, [movement, player]);


  return (
    <>
      <SocketManager handlerPlayers={handlerPlayers} handlerSetup={handlerSetup} handlerObjects={handlerObjects}/>
      <ambientLight intensity={0.5} />
      <directionalLight position={[-10, 10, 0]} intensity={2} />

      { (players) &&
        Object.entries(players).map(([id,player])=>(
          <Box key={id} position={player.position} quaternion={player.rotation} args={[1, 1, 1]}>
            <meshStandardMaterial color={player.color} />
          </Box>
        ))
      }

      {(player) && <Player player={player}/>}

      {
        (objects) && objects.map((value,i)=>
          <Box key={i} position={value.position} quaternion={value.rotation} args={value.sizes}>
            <meshStandardMaterial color={value.color} />
          </Box>
        )
        
      
      }
      
    </>
  )
}