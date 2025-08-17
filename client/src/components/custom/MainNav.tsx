import { Button } from '@/components/ui/button'
import { LogIn, Info, Home as HomeIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ModeToggle } from '@/components/mode-toggle'
import { useState } from 'react'

const navItems = [
  {
    name: 'Dashboard',
    href: '/about',
    icon: <Info className="h-4 w-4 text-gray-500" />,
  },
  {
    name: 'Bitácora',
    href: '/bitacora',
    icon: <HomeIcon className="h-4 w-4 text-gray-500" />,
  },
  {
    name: 'Sign Out',
    href: '/home',
    icon: <LogIn className="h-4 w-4 text-gray-500" />,
  },
]

export default function MainNav() {
  const [showId, setShowId] = useState(false)
  const userId = localStorage.getItem('user_id') || 'No ID'

  return (
    <div className="hidden md:flex items-center gap-4 w-full justify-between">
      <Link to="/home" className="flex items-center gap-2">
        <div className="bg-gray-300 w-8 h-8 rounded" />
        <span className="text-lg font-bold">Beholder</span>
      </Link>

      <div className="flex gap-2">
        <ModeToggle />

        {/* Botón hover para mostrar ID */}
        <Button
          asChild
          key="userId"
          variant="ghost"
          onClick={() => setShowId(!showId)}
        >
          <span>{showId ? userId : 'Obtener my ID de usuario'}</span>
        </Button>

        {navItems.map((item, index) => (
          <Button asChild key={index} variant="ghost">
            <Link
              to={item.href}
              className="flex items-center gap-2 text-sm font-medium"
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  )
}
