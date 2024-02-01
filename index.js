
const http = require('http');
const https = require('https');
const socketIo = require('socket.io');
const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS for all routes

const options = {
    key: fs.readFileSync('key.pem'),     // Replace with your own private key file
    cert: fs.readFileSync('cert.pem')    // Replace with your own certificate file
};

const server = https.createServer(options, app);
// const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ["http://localhost:4200", "https://localhost:4200", "https://192.168.0.105:4200"], // Adjust the origin to match your Angular app's URL
        methods: ["GET", "POST"]
    }
});
io.on('connection', (socket) => {
    let roomId = ''
    console.log('A user connected ==>',socket.id);

    // Handle media setup messages from the client
    socket.on('mediaSetup', (data) => {
        console.log('Received media setup from client:', data, k);

        // Broadcast the message to all connected clients except the sender
        socket.broadcast.emit('mediaSetup', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('join-room', (roomId) => {
        console.log('user room id==>',roomId)
        roomId = roomId
        socket.join(roomId);
    });

    socket.on('offer', (offer) => {
        // socket.to(roomId).emit('offerReceive', offer);
        socket.broadcast.emit('offerReceive', offer);
    });

    socket.on('answer', (answer) => {
        // console.log('ans',answer);
        // socket.to(roomId).emit('answer', answer);
        socket.broadcast.emit('answerReceive', answer);
    });

    socket.on('ice-candidate', (candidate) => {
        // socket.to(roomId).emit('ice-candidate', candidate);
        socket.broadcast.emit('ice-candidate-receive', candidate);
    });
});

app.get('/api', (req, res) => {
    res.send('hello world')
})

const PORT = 9008;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on https://192.168.0.105:${PORT}`)
});
// server.listen(PORT, () => {
//     console.log(`Server is running on https://192.168.0.105:${PORT}`)
// });
