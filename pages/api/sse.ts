import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // 1. Set HTTP headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Flush the headers to client immediately
    res.flushHeaders?.();

    console.log('SSE client connected (Data Stream).');

    // 2. Send an initial event (optional)
    res.write(`data: Hello, SSE! You are now connected.\n\n`);

    // 3. Send updates periodically (e.g., every 5 seconds)
    let counter = 0;
    const intervalId = setInterval(() => {
        counter++;
        const data = { message: `Server event #${counter}`, timestamp: new Date().toISOString() };
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    }, 5000);

    // 4. Cleanup on client disconnect
    req.socket.on('close', () => {
        console.log('SSE client disconnected (Data Stream).');
        clearInterval(intervalId);
        res.end();
    });
}
