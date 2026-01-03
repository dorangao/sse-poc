import { NextApiRequest, NextApiResponse } from 'next';

// Keep track of connected notification clients
type NotificationClient = {
    id: number;
    res: NextApiResponse;
};

let clients: NotificationClient[] = [];
let nextClientId = 1;

function broadcast(event: string, data: any) {
    clients.forEach(client => {
        client.res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const clientId = nextClientId++;
    const newClient: NotificationClient = { id: clientId, res };
    clients.push(newClient);

    console.log(`Notification client #${clientId} connected.`);

    // Broadcast join
    broadcast('user-connected', {
        count: clients.length,
        userId: clientId
    });

    // Send initial state to the new client
    res.write(`event: user-connected\ndata: ${JSON.stringify({ count: clients.length, userId: clientId })}\n\n`);

    req.socket.on('close', () => {
        console.log(`Notification client #${clientId} disconnected.`);
        clients = clients.filter(c => c.id !== clientId);

        // Broadcast leave
        broadcast('user-disconnected', {
            count: clients.length,
            userId: clientId
        });

        res.end();
    });
}
