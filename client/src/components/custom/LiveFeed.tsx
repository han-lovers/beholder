import React, { useEffect, useState } from 'react';

interface BitacoraItem {
  descripcion: string;
  hora: string;
}

export default function LiveFeed() {
  const [items, setItems] = useState<BitacoraItem[]>([]);

  useEffect(() => {
    const fetchBitacora = async () => {
      try {
        const response = await fetch('/bitacora');
        if (!response.ok) throw new Error('Error live feed');
        const data: BitacoraItem[] = await response.json();
        setItems(data);
      } catch (err) {
        console.log(err)
      }
    };

    fetchBitacora();
  }, []);


  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="p-3 border rounded bg-card text-left">
          <div className="text-sm">
            {new Date(item.hora).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
          <div className="font-medium">{item.descripcion}</div>
        </div>
      ))}
    </div>
  );
}