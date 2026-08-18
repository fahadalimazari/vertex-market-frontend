import { FiServer, FiHardDrive, FiActivity, FiShield } from 'react-icons/fi';

const CloudDashboard = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Cloud Control Center</h1>
        <p className="text-gray-500">Manage deployments, storage, CDN, and system health for the global infrastructure.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'System Uptime', value: '99.99%', icon: <FiActivity className="text-green-500" /> },
          { label: 'Active Clusters', value: '14', icon: <FiServer className="text-blue-500" /> },
          { label: 'Cloud Storage', value: '8.4 TB', icon: <FiHardDrive className="text-purple-500" /> },
          { label: 'Security Status', value: 'Optimal', icon: <FiShield className="text-orange-500" /> },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-xl">
              {stat.icon}
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
              <div className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Global Deployments</h2>
          <div className="space-y-4">
            {['US East (N. Virginia)', 'EU Central (Frankfurt)', 'Asia Pacific (Singapore)'].map((region, i) => (
              <div key={i} className="flex justify-between items-center p-4 border border-gray-50 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">{region}</span>
                </div>
                <span className="text-sm text-gray-500">V1.4.2 Active</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Database Health</h2>
          <div className="space-y-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Primary Database (MongoDB)</span>
              <span className="text-sm font-medium text-green-600">Healthy</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
            
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Cache Layer (Redis)</span>
              <span className="text-sm font-medium text-green-600">Healthy</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudDashboard;
