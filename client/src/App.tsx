import { ThemeProvider } from '@/components/theme-provider'
import { DeviceKeyProvider } from '@/context/DeviceKeyContext'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LayoutAbout from '@/Layout'
import LayoutLogin from '@/LayoutLogin'
import Home from '@/pages/Home'
import About from '@/pages/About'
import Login from '@/pages/Login'
import Bitacora from '@/pages/Bitacora'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <DeviceKeyProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route element={<LayoutLogin />}>
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home />} />
            </Route>

            <Route element={<LayoutAbout />}>
              <Route path="/about" element={<About />} />
              <Route path="/bitacora" element={<Bitacora />} />
              <Route path="/home" element={<Home />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DeviceKeyProvider>
    </ThemeProvider>
  )
}

export default App