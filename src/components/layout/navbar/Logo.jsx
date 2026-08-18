import { Link } from 'react-router-dom'

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img src="/logo.png" alt="Vertex Market Logo" className="h-8 w-8 object-contain" />
      <div className="text-[24px] sm:text-[28px] font-bold leading-tight tracking-tight">
        <span className="text-gray-900">Vertex </span>
        <span className="text-[#ff6a00]">Market</span>
      </div>
    </Link>
  )
}

export default Logo