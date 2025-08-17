import { Button } from '@/components/ui/button'
import { LogIn, Info, Home as HomeIcon, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ModeToggle } from '@/components/mode-toggle'
import { useState, useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { useDeviceKey } from '@/context/DeviceKeyContext'

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
  const [addresses, setAddresses] = useState<string[]>([])
  const { selectedKey, setSelectedKey } = useDeviceKey()


  useEffect(() => {
    if (userId === 'No ID') return
    fetch(`https://api-257470668223.us-central1.run.app/v1/user/${userId}/children_addresses`)
      .then(res => res.json())
      .then(data => setAddresses(data.children_addresses || []))
      .catch(() => setAddresses([]))
  }, [userId])


  return (
    <div className="hidden md:flex items-center gap-4 w-full justify-between">
      <Link to="/home" className="flex items-center gap-2">
        <div className="bg-gray-300 w-8 h-8 rounded" />
        <span className="text-lg font-bold">Beholder</span>
      </Link>

      <div className="flex gap-2">

        <ModeToggle />

        {/* child addresses*/}  
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              {selectedKey ? `Dispositivo: ${selectedKey}` : 'Dispositivos de mi(s) hijo(s)'}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {addresses.length === 0 ? (
              <DropdownMenuItem disabled>No hay dispositivos</DropdownMenuItem>
            ) : (
              addresses.map((addr, i) => (
                <DropdownMenuItem
                  key={i}
                  onSelect={() => setSelectedKey(addr)}
                  className={addr === selectedKey ? 'bg-accent' : ''}
                >
                  {addr}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>


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
