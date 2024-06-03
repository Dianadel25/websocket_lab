const WebSocket = require('ws');
const express = require('express');

const app = express();
const port = 8080;

const wss = new WebSocket.Server({ noServer: true });

const services = {
    '1234567890': { sugar: 50, pulp: 100 },
    '0987654321': { sugar: 75, pulp: 150 },
};

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        const ipn = message.toString();
        console.log('Received IPN:', ipn);

        if (services[ipn]) {
            const response = {
                sugar: services[ipn].sugar,
                pulp: services[ipn].pulp,
            };
            ws.send(JSON.stringify(response));
        } else {
            ws.send(JSON.stringify({ error: 'Invalid IPN' }));
        }
    });

    ws.send('Connected to corporate chat');
});

const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});
