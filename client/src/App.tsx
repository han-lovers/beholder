import { ThemeProvider } from '@/components/theme-provider'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/Layout'
import Home from '@/pages/Home'
import About from '@/pages/About'
import Login from '@/pages/Login'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          {/* Redirigir raíz a login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Ruta sin layout */}
          <Route path="/login" element={<Login />} />

          {/* Grupo de rutas con Layout */}
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
