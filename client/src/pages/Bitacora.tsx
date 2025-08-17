

import { useEffect, useState } from 'react';

interface BitacoraItem {
  hora: string;
  tipo: string;
  descripcion: string;
}

const tipoLabels: Record<string, string> = {
  leve: 'Leve',
  intermedio: 'Intermedio',
  alto: 'Alto',
};

const tipoColors: Record<string, string> = {
  leve: 'bg-yellow-300',
  intermedio: 'bg-orange-400',
  alto: 'bg-red-500',
};

export default function Bitacora() {
  const [items, setItems] = useState<BitacoraItem[]>([]);
  const [sort, setSort] = useState<'recientes' | 'antiguos'>('recientes');

  useEffect(() => {
    fetch('/bitacora')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(() => setItems([]));
  }, []);

  const sortedItems = [...items].sort((a, b) => {
    if (sort === 'recientes') {
      return new Date(b.hora).getTime() - new Date(a.hora).getTime();
    } else {
      return new Date(a.hora).getTime() - new Date(b.hora).getTime();
    }
  });

  const totalAlertas = items.length;
  const porTipo: Record<string, number> = { leve: 0, intermedio: 0, alto: 0 };
  items.forEach(i => {
    if (porTipo[i.tipo] !== undefined) porTipo[i.tipo]++;
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
    <h1 className="text-left text-6xl font-bold p-4">Resumen de Bitácora</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-card rounded-xl shadow p-6 flex flex-col items-center">
          <div className="text-3xl font-bold text-primary mb-2">{totalAlertas}</div>
          <div className="text-sm text-muted-foreground">Total de alertas</div>
        </div>
        <div className="bg-card rounded-xl shadow p-6 flex flex-col items-center">
          <div className="text-lg font-semibold mb-2">Detalles por tipo</div>
          <div className="flex gap-3">
            {Object.keys(porTipo).map(tipo => (
              <div key={tipo} className={`flex flex-col items-center ${tipoColors[tipo] || ''} rounded p-2 min-w-[60px]`}>
                <span className="text-lg font-bold text-white">{porTipo[tipo]}</span>
                <span className="text-xs text-white">{tipoLabels[tipo] || tipo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow p-6 mb-8">
        <div className="text-lg font-semibold mb-4">Evolución de alertas por tipo</div>
        <div className="flex items-end gap-4 h-32">
          {Object.keys(porTipo).map(tipo => (
            <div key={tipo} className="flex flex-col items-center flex-1">
              <div
                className={`${tipoColors[tipo] || 'bg-gray-300'} w-8 rounded-t transition-all`}
                style={{ height: `${(porTipo[tipo] / (totalAlertas || 1)) * 100}%` }}
                title={`${porTipo[tipo]} ${tipoLabels[tipo] || tipo}`}
              ></div>
              <span className="text-xs mt-2">{tipoLabels[tipo] || tipo}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">

        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded ${sort === 'recientes' ? 'bg-primary text-white' : 'bg-muted'}`}
            onClick={() => setSort('recientes')}
          >
            Más recientes
          </button>
          <button
            className={`px-3 py-1 rounded ${sort === 'antiguos' ? 'bg-primary text-white' : 'bg-muted'}`}
            onClick={() => setSort('antiguos')}
          >
            Más antiguos
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {sortedItems.length === 0 && (
          <div className="text-center text-muted-foreground">Sin registros en la bitácora</div>
        )}
        {sortedItems.map((item, idx) => (
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
    </div>
  );
}
