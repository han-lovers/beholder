import MainNav from '@/components/custom/MainNavLogin'
import MobileNav from '@/components/custom/MobileNavLogin'

export default function Header() {
  return (
    <header className="w-full border-b">
      <div className="flex h-14 items-center px-4">
        <MobileNav />
        <MainNav />
      </div>
    </header>
  )
}
