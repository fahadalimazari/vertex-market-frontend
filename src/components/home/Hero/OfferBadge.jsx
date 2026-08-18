const OfferBadge = () => {
  return (
    <div className="absolute -top-3 -right-3 z-10">
      <div className="relative">
        {/* Main badge */}
        <div className="bg-gradient-to-br from-[#F97316] to-[#FB923C] rounded-[12px] px-4 py-2.5 text-white shadow-lg">
          <div className="text-center">
            <div className="text-[11px] font-bold uppercase tracking-wider">UP TO</div>
            <div className="text-[20px] font-extrabold leading-none mt-1">50% OFF</div>
          </div>
        </div>
        
        {/* Small decorative triangle */}
        <div className="absolute -bottom-1 right-4 w-3 h-3 bg-[#F97316] transform rotate-45"></div>
      </div>
    </div>
  )
}

export default OfferBadge