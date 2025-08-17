
import { AlertTriangle } from 'lucide-react';

type AlertasProps = {
  leve: number;
  intermedio: number;
  alto: number;
};

const alertas = [
  { color: 'bg-[#d4bb18]', border: 'border-[#d4bb18]', label: 'Alerta leve', key: 'leve' },
  { color: 'bg-[#f59e0b]', border: 'border-[#f59e0b]', label: 'Alerta media', key: 'intermedio' },
  { color: 'bg-[#a12323]', border: 'border-[#a12323]', label: 'Alerta grave', key: 'alto' },
];

export default function Alertas({ leve, intermedio, alto }: AlertasProps) {
  const counts = { leve, intermedio, alto };
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
            <span className="text-3xl font-extrabold text-white">{counts[a.key as keyof typeof counts]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
