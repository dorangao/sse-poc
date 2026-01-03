import { useEffect, useState } from 'react';

interface ServerEvent {
  message: string;
  timestamp: string;
}

export default function Home() {
  const [events, setEvents] = useState<ServerEvent[]>([]);
  const [status, setStatus] = useState('Disconnected');

  useEffect(() => {
    // Open an SSE connection to our API
    const eventSource = new EventSource('/api/sse');

    eventSource.onopen = () => {
      console.log('SSE connection opened');
      setStatus('Connected');
    };

    // Default message handler for any event without a specific type
    eventSource.onmessage = (event) => {
      console.log('Received event:', event.data);
      try {
        // Skip the initial "Hello" message if it's not JSON
        if (event.data.startsWith('Hello')) {
          return;
        }
        const data: ServerEvent = JSON.parse(event.data);
        // Update state with new event data
        setEvents(prev => [...prev, data]);
      } catch (err) {
        console.error('Error parsing SSE event:', err);
      }
    };

    // Error handling (optional)
    eventSource.onerror = (event) => {
      console.error('SSE error:', event);
      // connecting state is 0, open is 1, closed is 2
      if (eventSource.readyState === EventSource.CLOSED) {
        console.log('SSE connection closed');
        setStatus('Disconnected');
      } else if (eventSource.readyState === EventSource.CONNECTING) {
        setStatus('Reconnecting...');
      }
    };

    // Cleanup when component unmounts (stop listening to SSE)
    return () => {
      eventSource.close();
      setStatus('Closed');
    };
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>🟢 SSE Live Events</h1>
      <p>Status: <strong>{status}</strong></p>
      <ul>
        {events.map((ev, idx) => (
          <li key={idx}>
            <strong>{ev.message}</strong> at {new Date(ev.timestamp).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
