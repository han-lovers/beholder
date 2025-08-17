import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function CrearAlerta() {
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await fetch('/api/alerta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje }),
      });
      if (!res.ok) throw new Error('Error al enviar la alerta');
      setSuccess('¡Alerta enviada!');
      setMensaje('');
    } catch (err) {
      setError('No se pudo enviar la alerta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 max-w-md mx-auto">
      <AlertTriangle className="w-24 h-24 text-[#a12323] mb-4" />
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <textarea
          className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary resize-none min-h-[80px]"
          placeholder="Escribe tu alerta aquí..."
          value={mensaje}
          onChange={e => setMensaje(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-2 rounded-md font-semibold bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar Alerta'}
        </button>
        {success && <div className="text-green-600 text-center">{success}</div>}
        {error && <div className="text-red-500 text-center">{error}</div>}
      </form>
    </div>
  );
}
