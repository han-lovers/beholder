import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [mail, setMail] = useState('')
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [passwordConf, setPasswordConf] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    if (yeii) {
      navigate('/about')
    } else {
      alert('Credenciales incorrectas. Inténtalo de nuevo.')
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('https://api-257470668223.us-central1.run.app/v1/web/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: mail,
          password: password,
          password_confirmation: passwordConf,
        }),
      })

      const data = await response.json()

      if (data.error) {
        alert(data.error)
      } else {
        navigate('/about')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-sm bg-card">
        <div className="flex justify-center mb-4">
          <img
            src={
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvwEWnX6R0e4Y_0z7z9W8dgocqvdGQ7lrwfg&s'
            }
            alt="Logo"
            className="w-24 h-24"
          />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-azulInstitucional dark:text-verdeInstitucional">
          Beholder
        </h2>
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 rounded-l-md font-semibold ${tab === 'login' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            onClick={() => setTab('login')}
            disabled={tab === 'login'}
          >
            Iniciar sesión
          </button>
          <button
            className={`flex-1 py-2 rounded-r-md font-semibold ${tab === 'signup' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            onClick={() => setTab('signup')}
            disabled={tab === 'signup'}
          >
            Registrarse
          </button>
        </div>
        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
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
                type="password"
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
              Log In
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
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
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 ">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1 ">
                Confirmar contraseña
              </label>
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={passwordConf}
                onChange={(e) => setPasswordConf(e.target.value)}
                className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-md font-semibold bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
            >
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
