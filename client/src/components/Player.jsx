import { Box } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3 } from 'three';

export default function Player({ player }){

    const container = useRef();
    const character = useRef();
    const cameraTarget = useRef();
    const cameraPosition = useRef();
    const cameraWorldPosition = useRef(new Vector3());
    const cameralookAtWorldPosition = useRef(new Vector3());
    const cameralookAt = useRef(new Vector3());

    useFrame(({ camera }) => {

        // Atualizar posições da câmera
        cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
        camera.position.lerp(cameraWorldPosition.current, 0.1);
        

        cameraTarget.current.getWorldPosition(cameralookAtWorldPosition.current);
        cameralookAt.current.lerp(cameralookAtWorldPosition.current, 0.1);
        camera.lookAt(cameralookAt.current);
    });

    return(
        <group position={player.position}>
            <group ref={character}>
                <Box position={[0, 0, 0]} args={[1, 1, 1]}>
                    <meshStandardMaterial color={player.color} />
                </Box>
                <group ref={container}>
                    <group ref={cameraTarget} position={[0, 0, 1.5]} />
                    <group ref={cameraPosition} position={[0, 7, -10]} />
                </group>
            </group>
        </group> 
    )
}