import { Link } from 'react-router-dom'
import { MAIN_MENU_ITEMS, SUPPORT_MENU_ITEMS } from '../../../data/navigation'
import CategoriesButton from './CategoriesButton'

const DesktopMenu = () => {

  return (
    <div className="hidden lg:block border-b border-[#E5E7EB]">
      <div className="mx-auto flex h-12 max-w-[1280px] items-center justify-between px-6">
        {/* Left: Categories Button and Main Menu Items */}
        <div className="flex items-center gap-6">
          <CategoriesButton />
          
          <nav className="flex items-center gap-6">
            {MAIN_MENU_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-[15px] font-medium text-[#374151] hover:text-[#2563EB] transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0 after:bg-[#2563EB] after:transition-all hover:after:w-full"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Track Order and Customer Support with Icons */}
        <nav className="flex items-center gap-6">
          {SUPPORT_MENU_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center gap-2 text-[15px] font-medium text-[#374151] hover:text-[#2563EB] transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0 after:bg-[#2563EB] after:transition-all hover:after:w-full"
              >
                <Icon className="h-[18px] w-[18px]" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default DesktopMenu