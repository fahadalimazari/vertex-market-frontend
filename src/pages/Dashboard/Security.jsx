import SecurityForm from '../../components/Dashboard/SecurityForm'
import MfaSection from '../../components/Dashboard/MfaSection'
import ActiveSessions from '../../components/Dashboard/ActiveSessions'

const Security = () => {
  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
        <p className="text-[14px] text-gray-500 mt-1">Update your password and secure your account.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SecurityForm />
        <MfaSection />
        <ActiveSessions />
      </div>
    </div>
  )
}

export default Security
