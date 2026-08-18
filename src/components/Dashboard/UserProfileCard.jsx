import { useDashboard } from '../../context/Dashboard/DashboardContext'

const UserProfileCard = () => {
  const { userProfile } = useDashboard()

  return (
    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
      <div className="w-14 h-14 bg-white rounded-full border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
        <img src={userProfile.avatar} alt={userProfile.fullName} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] font-bold text-gray-900 truncate">{userProfile.fullName}</h3>
        <p className="text-[13px] text-gray-500 truncate">{userProfile.email}</p>
      </div>
    </div>
  )
}

export default UserProfileCard
