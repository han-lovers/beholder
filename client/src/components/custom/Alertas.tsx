import { AlertTriangle } from 'lucide-react';

const alertas = [
  { color: 'bg-[#d4bb18]', border: 'border-[#d4bb18]', label: 'Alerta leve', numero: 3 },
  { color: 'bg-[#f59e0b]', border: 'border-[#f59e0b]', label: 'Alerta media', numero: 2 },
  { color: 'bg-[#a12323]', border: 'border-[#a12323]', label: 'Alerta grave', numero: 1 },
];

export default function Alertas() {
  return (
    <div className="flex flex-col items-center gap-4 w-full p-4">
      <div className="flex gap-8">
        {alertas.map((a, i) => (
          <div
            key={i}
            className={`flex flex-col items-center p-6 rounded-2xl shadow-lg border-4 ${a.border} ${a.color} bg-opacity-80 min-w-[120px]`}
          >
            <AlertTriangle className="w-16 h-16 text-white mb-2 drop-shadow" />
            <span className="font-bold text-lg text-white mb-2">{a.label}</span>
            <span className="text-3xl font-extrabold text-white">{a.numero}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
