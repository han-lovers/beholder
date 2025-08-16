import { ThemeProvider } from '@/components/theme-provider'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/Layout'
import LayoutLogin from '@/LayoutLogin'
import Home from '@/pages/Home'
import About from '@/pages/About'
import Login from '@/pages/Login'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route element={<LayoutLogin />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<Layout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
