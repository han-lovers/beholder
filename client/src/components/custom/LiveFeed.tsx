import React, { useEffect, useRef, useState } from 'react';
import { useDeviceKey } from '@/context/DeviceKeyContext';

interface FeedItem {
  hora: string;
  tipo: string;
  descripcion: string;
}


type LiveFeedProps = {
  onTipoCountChange?: (counts: { leve: number; intermedio: number; alto: number }) => void;
};

export default function LiveFeed({ onTipoCountChange }: LiveFeedProps) {
    const { selectedKey } = useDeviceKey();
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [counts, setCounts] = useState({ leve: 0, intermedio: 0, alto: 0 });
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/v1/web/${selectedKey}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setFeed(prev => [data, ...prev].slice(0, 5));
        setCounts(prev => {
          const newCounts = { ...prev };
          if (data.tipo === 'leve' || data.tipo === 'intermedio' || data.tipo === 'alto') {
            newCounts[data.tipo] = (newCounts[data.tipo] || 0) + 1;
          }
          return newCounts;
        });
      } catch {}
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (onTipoCountChange) {
      onTipoCountChange(counts);
    }
  }, [counts, onTipoCountChange]);

  return (
    <div className="flex flex-col gap-2 w-full max-w-lg mx-auto p-4">
      {feed.length === 0 && (
        <div className="text-center text-muted-foreground">Sin actualizaciones recientes</div>
      )}
      {feed.map((item, idx) => (
        <div key={idx} className="flex items-start gap-3 p-3 bg-card rounded shadow border border-gray-200">
          <div className="flex flex-col items-center min-w-[60px]">
            <span className="text-xs text-gray-500 font-mono">
              {new Date(item.hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className="text-xs text-gray-400 mt-1">{item.tipo}</span>
          </div>
          <div className="flex-1 text-left">
            <span className="font-medium">{item.descripcion}</span>
          </div>
        </div>
      ))}
    </div>
  );
}