import AccountForm from '../../components/Dashboard/AccountForm'
import NotificationPreferences from '../../components/Notifications/NotificationPreferences'

const Settings = () => {
  return (
    <div className="space-y-10 max-w-4xl">
      <div className="max-w-2xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
          <p className="text-[14px] text-gray-500 mt-1">Manage your personal information and preferences.</p>
        </div>

        <AccountForm />
      </div>

      <div className="w-full h-[1px] bg-gray-100" />

      <div>
        <NotificationPreferences />
      </div>
    </div>
  )
}

export default Settings

