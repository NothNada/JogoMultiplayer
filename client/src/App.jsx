import { Canvas } from '@react-three/fiber'
import Experience from './components/Experience'

export default function App() {

  return (
    <Canvas camera={{ position:[10,10,10] , fov:30 }}>
      <color attach="background" args={['#aeaeae']} />
      <Experience/>
    </Canvas>
  )
}
