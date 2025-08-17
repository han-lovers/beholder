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
import Logo from '../assets/logo.png' 

const navItems = [
  {
    name: 'Home',
    href: '/home',
    icon: <HomeIcon className="h-4 w-4 text-gray-500" />,
  }
]

const outputItem = {
  name: 'Login',
  href: '/login',
  icon: <LogIn className="h-4 w-4 text-gray-500" />,
}

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex items-center gap-2 md:hidden w-full justify-between">
      {/* Logo temporal */}
      <Link to="/" className="flex items-center gap-2">
        <img src={Logo} alt="Beholder" className="w-8 h-8 rounded" />
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
          <DropdownMenuItem asChild variant="destructive">
            <Link to={outputItem.href} className="flex items-center gap-2">
              {outputItem.icon}
              <span>{outputItem.name}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
