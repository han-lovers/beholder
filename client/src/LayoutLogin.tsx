import { Outlet } from 'react-router-dom'
import HeaderLogin from '@/components/custom/HeaderLogin'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderLogin />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  )
}
