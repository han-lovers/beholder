import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { LogIn, Info, Home as HomeIcon, Menu as MenuIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

const navItems = [
  {
    name: 'Home',
    href: '/home',
    icon: <HomeIcon className="h-4 w-4 text-gray-500" />,
  },
  {
    name: 'About',
    href: '/about',
    icon: <Info className="h-4 w-4 text-gray-500" />,
  },
]

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex items-center gap-2 md:hidden w-full justify-between">
      {/* Logo temporal */}
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-gray-300 w-8 h-8 rounded" /> {/* Logo placeholder */}
        <span className="text-lg font-bold">Beholder</span>
      </Link>

      {/* Menú hamburguesa */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {navItems.map((item, index) => (
            <DropdownMenuItem key={index} asChild>
              <Link to={item.href} className="flex items-center gap-2">
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
