import { Button } from '@/components/ui/button'
import { LogIn, Info, Home as HomeIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ModeToggle } from '@/components/mode-toggle'

const navItems = [
  {
    name: 'Home',
    href: '/home',
    icon: <HomeIcon className="h-4 w-4 text-gray-500" />,
  }
]

const outputItem = {
  name: 'Login',
  href: '/',
  icon: <LogIn className="h-4 w-4 text-gray-500" />,
}

export default function MainNav() {
  return (
    <div className="hidden md:flex items-center gap-4 w-full justify-between">
      <Link to="/home" className="flex items-center gap-2">
        <div className="bg-gray-300 w-8 h-8 rounded" />
        <span className="text-lg font-bold">Beholder</span>
      </Link>

      <div className="flex gap-2">
        <ModeToggle />
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
        <Button asChild variant="default">
                  <Link
                    to={outputItem.href}
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    {outputItem.icon}
                    <span>{outputItem.name}</span>
                  </Link>
                </Button>
      </div>
    </div>
  )
}
