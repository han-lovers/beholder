import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate()
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');

 const handleLogin = async (e: React.FormEvent) => {
    if (yeiiLoHagoAlRato) {
      navigate('/about');
    } else {
      alert('Credenciales incorrectas. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        className="p-8 rounded-lg shadow-lg w-full max-w-sm  bg-card"
        onSubmit={handleLogin}
      >
        <div className="flex justify-center mb-4">
          <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvwEWnX6R0e4Y_0z7z9W8dgocqvdGQ7lrwfg&s"} alt="Logo" className="w-24 h-24" />
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center text-azulInstitucional dark:text-verdeInstitucional">
          Beholder
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            value={mail}
            placeholder="Correo"
            onChange={(e) => setMail(e.target.value)}
                        className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"

            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 ">
            Contraseña
          </label>
          <input
            type="text"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-md font-semibold bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  )
}
