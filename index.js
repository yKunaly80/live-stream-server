// const express = require('express')
// const http = require('http');
// const socketIo = require('socket.io');
// const path = require('path');

// const app = express()
// const server = http.createServer(app);
// const io = socketIo(server);

// const port = 9008

// // // Serve your Angular app (adjust the path accordingly)
// // app.use(express.static('http://localhost:4200'));

// // Serve your Angular app
// const angularAppPath = path.join(__dirname, '../live-stream-ui'); // Adjust the path accordingly
// app.use('/live-class', express.static(angularAppPath));

// // Socket.IO connection handling
// io.on('connection', (socket) => {
//     console.log('A user connected');

//     // Example: Listen for the 'example-event' from the client
//     socket.on('example-event', (data) => {
//         console.log('Received example event:', data);

//         // Example: Send a response back to the client
//         io.emit('server-response', { message: 'Hello, client!' });
//     });

//     // Disconnect handling
//     socket.on('disconnect', () => {
//         console.log('User disconnected');
//     });
// });

// app.get('/api', (req, res) => {
//     res.send('hello world')
// })

// app.listen(port, () => {
//     console.log(`Example app listening on port http://localhost:${port}`);
// })


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
    console.log('A user connected');

    // Handle media setup messages from the client
    socket.on('mediaSetup', (data) => {
        console.log('Received media setup from client:', data);

        // Broadcast the message to all connected clients except the sender
        socket.broadcast.emit('mediaSetup', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.get('/api', (req, res) => {
    res.send('hello world')
})

const PORT = 9008;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on https://192.168.0.105:${PORT}`)
});
