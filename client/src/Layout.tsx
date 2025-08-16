import { Outlet } from 'react-router-dom'
import Header from '@/components/custom/Header'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  )
}
