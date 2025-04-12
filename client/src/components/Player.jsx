import { Box } from '@react-three/drei'

export default function Player({ player }){
    return(
        <Box position={player.position} args={[1,1,1]}>
            <meshStandardMaterial color={player.color} />
        </Box>
    )
}