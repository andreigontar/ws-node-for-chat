const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', (ws) => {

    const userId = Date.now();

    const connectMessage = JSON.stringify({
        isNotification: true,
        text: `User ${userId} connected`
    });

    // Отправка уведомления о подключении всем клиентам
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(connectMessage);
        }
    });

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            // Пересылка сообщения всем клиентам
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    });

    ws.on('close', () => {
        const disconnectMessage = JSON.stringify({
            isNotification: true,
            text: `User ${userId} disconnected`
        });

        // Отправка уведомления об отключении всем клиентам
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(disconnectMessage);
            }
        });

        console.log(`User ${userId} disconnected`);
    });

    console.log('New client connected');
});

console.log('WebSocket server is running on ws://localhost:3001');