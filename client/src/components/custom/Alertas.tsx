
import { AlertTriangle } from 'lucide-react';

type AlertasProps = {
  low: number;
  medium: number;
  high: number;
};

const alertas = [
  { color: 'bg-[#d4bb18]', border: 'border-[#d4bb18]', label: 'Alerta leve', key: 'low' },
  { color: 'bg-[#f59e0b]', border: 'border-[#f59e0b]', label: 'Alerta media', key: 'medium' },
  { color: 'bg-[#a12323]', border: 'border-[#a12323]', label: 'Alerta grave', key: 'high' },
];

export default function Alertas({ low, medium, high }: AlertasProps) {
  const counts = { low, medium, high };
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
