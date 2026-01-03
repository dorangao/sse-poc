
import { useEffect, useState } from 'react';

interface ServerEvent {
  message?: string;
  timestamp?: string;
  count?: number;
  userId?: number;
}

export default function Home() {
  const [events, setEvents] = useState<ServerEvent[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [activeCount, setActiveCount] = useState<number>(0);
  const [dataStatus, setDataStatus] = useState('Disconnected');
  const [notifStatus, setNotifStatus] = useState('Disconnected');

  useEffect(() => {
    // 1. Data Stream Connection (/api/sse)
    const dataSource = new EventSource('/api/sse');

    dataSource.onopen = () => setDataStatus('Connected');

    dataSource.onmessage = (event) => {
      try {
        if (event.data.startsWith('Hello')) return;
        const data: ServerEvent = JSON.parse(event.data);
        setEvents(prev => [...prev, data]);
      } catch (err) {
        console.error('Data stream parse error:', err);
      }
    };

    dataSource.onerror = () => {
      if (dataSource.readyState === EventSource.CLOSED) setDataStatus('Disconnected');
      else setDataStatus('Reconnecting...');
    };

    // 2. Notification Stream Connection (/api/notifications)
    const notifSource = new EventSource('/api/notifications');

    notifSource.onopen = () => setNotifStatus('Connected');

    notifSource.addEventListener('user-connected', (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      setActiveCount(data.count);
      const msg = `User #${data.userId} joined`;
      setNotifications(prev => [msg, ...prev].slice(0, 5));
    });

    notifSource.addEventListener('user-disconnected', (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      setActiveCount(data.count);
      const msg = `User #${data.userId} left`;
      setNotifications(prev => [msg, ...prev].slice(0, 5));
    });

    notifSource.onerror = () => {
      if (notifSource.readyState === EventSource.CLOSED) setNotifStatus('Disconnected');
      else setNotifStatus('Reconnecting...');
    };

    return () => {
      dataSource.close();
      notifSource.close();
      setDataStatus('Closed');
      setNotifStatus('Closed');
    };
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🟢 SSE Live Events (Dual Stream)</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
          <h3>Data Stream</h3>
          <p>Status: <strong>{dataStatus}</strong></p>
        </div>
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
          <h3>Notification Stream</h3>
          <p>Status: <strong>{notifStatus}</strong></p>
          <p>Active Clients: <strong>{activeCount}</strong></p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 1 }}>
          <h3>Latest Notifications</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {notifications.map((note, idx) => (
              <li key={idx} style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>
                {note}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1 }}>
          <h3>Server Events</h3>
          {events.length === 0 && <p>Waiting for events...</p>}
          <ul>
            {events.map((ev, idx) => (
              <li key={idx}>
                <strong>{ev.message}</strong> <small>{ev.timestamp ? new Date(ev.timestamp!).toLocaleTimeString() : ''}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

}
