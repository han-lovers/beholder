import { useState } from 'react';

const denuncias = [
  { nombre: 'Juan Pérez', app: 'WhatsApp' },
  { nombre: 'Ana López', app: 'Instagram' },
  { nombre: 'Carlos Ruiz', app: 'TikTok' },
];

export default function Denuncias() {
  const [showMensaje, setShowMensaje] = useState(false);

  return (
    <div className="w-full flex flex-col items-center p-10">
      {showMensaje ? (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <h2 className="text-2xl text-black font-bold mb-4">Motivo de denuncia</h2>
            <p className="mb-6 text-black">cbhbdck dcbdbcnhjbchj.</p>
            <button
              className="px-6 py-2 rounded-md bg-blue-900 text-black font-semibold hover:bg-primary/90"
              onClick={() => setShowMensaje(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      ) : (
        <table className="w-full mx-auto bg-card rounded-xl shadow-lg overflow-hidden text-center items-center">
          <thead className="bg-muted text-center items-center justify-center">
            <tr>
              <th className="py-3 px-4 text-center">Name Tag</th>
              <th className="py-3 px-4 text-center">App</th>
              <th className="py-3 px-4 text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {denuncias.map((d, i) => (
              <tr key={i} className="border-b last:border-b-0 bg-background">
                <td className="py-3 px-4">{d.nombre}</td>
                <td className="py-3 px-4">{d.app}</td>
                <td className="py-3 px-4">
                  <button
                    className="px-4 py-1 rounded bg-[#a12323] text-white font-semibold hover:bg-red-600"
                    onClick={() => setShowMensaje(true)}
                  >
                    Info
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
