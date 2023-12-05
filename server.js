import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { v4 } from 'uuid';

const server = createServer();
const wsServer = new WebSocketServer({ server });
const port = 5173;
server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});

const clients = {};

wsServer.on('connection', function(connection) {
  const userId = v4();  
  console.log(`Received a new connection.`);

  clients[userId] = connection;
  console.log(`${userId} connected.`);

  connection.on('message', function(data) {
    console.log(`Received message from ${userId}: ${data}`);
    connection.send('UID received.');
  });

  // Handle client disconnection
  connection.on('close', function() {
    delete clients[userId];
    console.log(`${userId} disconnected.`);
  });
});