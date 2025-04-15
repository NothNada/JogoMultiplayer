import { Server } from 'socket.io';
import RAPIER from '@dimforge/rapier3d-compat';
import { createServer } from 'http'; // Importa o módulo HTTP

await RAPIER.init();

const httpServer = createServer(); // Cria um servidor HTTP básico

const io = new Server(httpServer, { // Passa o servidor HTTP para o Socket.IO
  cors: {
    origin: "*",
  },
});

const PORT = 3001;
const HOST = '192.168.2.52'; // Seu IP local

httpServer.listen(PORT, HOST, () => {
  console.log(`Servidor Socket.IO rodando em http://${HOST}:${PORT}`);
});

const players = {};

const world = new RAPIER.World({x:0.0, y:-100, z:0.0});
const objects = [];

const chaoDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(0,0,0);
const body = world.createRigidBody(chaoDesc);
world.createCollider(
  RAPIER.ColliderDesc.cuboid(10, 0.5, 10),
  body
);
objects.push({
  id:'chao',
  body,
  sizes:[20,1,20],
  color:"#f00",
});

const randomPosition = () => {
  return new RAPIER.Vector3(Math.floor(Math.random() * 6),0,Math.floor(Math.random() * 6));
};

const randomColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

/*

const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

*/

const updatePlayersF = () => {
  const playersToClient = {};
  for(let id in players){
    const player = players[id];
    const pos = player.body.translation();
    const rotation = player.body.rotation();
    playersToClient[id] = {
      id:id,
      position:[pos.x, pos.y, pos.z],
      color:player.color,
      rotation:[rotation.x, rotation.y, rotation.z, rotation.w],
      rotation2:players[id].rotation,
    };
  }
  io.emit('updatePlayers',playersToClient);

  const objectsToClient = [];
  for(let obj of objects){
    const pos = obj.body.translation();
    const rotation = obj.body.rotation();
    objectsToClient.push({
      position:[pos.x, pos.y, pos.z],
      rotation:[rotation.x, rotation.y, rotation.z, rotation.w],
      sizes:obj.sizes,
      color:obj.color,
    });
  }
  io.emit('updateObjects',objectsToClient);
};

io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  const bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 5, 0);
  const body = world.createRigidBody(bodyDesc);
  const collider = world.createCollider(
    RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5), // 0.5 * 2 = 1
    body
  );
  body.setTranslation(randomPosition());
  const pos = body.translation();
  const rotation = body.rotation();

  players[socket.id] = {
    id:socket.id,
    rotation:0,
    body,
    color:randomColor(),
  };

  socket.emit('setup',{
    id:socket.id,
    position:[pos.x, pos.y, pos.z],
    color:players[socket.id].color,
    rotation:[rotation.x, rotation.y, rotation.z, rotation.w],
  });

  updatePlayersF();

  socket.on('move', (data) => {

    movePlayer(socket.id,data);

    updatePlayersF();
  });

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
    world.removeRigidBody(players[socket.id].body);
    delete players[socket.id];
    updatePlayersF();
  });
});

function movePlayer(id,data){
  const movement = { x:0, z:0 };
  const velocity = { x:0, y:0, z:0 };
  const speed = 5;
  const rotationSpeed = 0.005;

  if(data.forward){
    movement.z = 1;
  }
  if(data.backward){
    movement.z = -1;
  }
  if(data.left){
    movement.x = 1;
  }
  if(data.right){
    movement.x = -1;
  }
  if(data.jump){
    velocity.y = speed;
  }

  if (movement.x !== 0) {
    players[id].rotation += rotationSpeed * movement.x;
  }

  if (movement.x !== 0 || movement.z !== 0) {
    const sla = Math.atan2(movement.x,movement.z);
    velocity.x = Math.sin(players[id].rotation + sla) * speed;
    velocity.z = Math.cos(players[id].rotation + sla) * speed;
  }

  players[id].body.setLinvel(velocity, true);
  players[id].body.setRotation(
    new RAPIER.Quaternion(0, Math.sin(players[id].rotation/2), 0, Math.cos(players[id].rotation/2)),
    true
  );
}

setInterval(()=>{
  updatePlayersF();

  world.step();
},1000 / 60);