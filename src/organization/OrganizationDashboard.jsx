import { FiBriefcase, FiMapPin, FiUsers, FiShield } from 'react-icons/fi';

const OrganizationDashboard = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Organization & Franchises</h1>
        <p className="text-gray-500">Manage global branches, departments, teams, and territory permissions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Branches', value: '24', icon: <FiMapPin className="text-blue-500" /> },
          { label: 'Active Employees', value: '1,420', icon: <FiUsers className="text-orange-500" /> },
          { label: 'Departments', value: '12', icon: <FiBriefcase className="text-purple-500" /> },
          { label: 'Security Roles', value: '8', icon: <FiShield className="text-green-500" /> },
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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">Global Branches</h2>
          <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium">Add Branch</button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 text-sm border-b border-gray-100">
              <th className="pb-3">Branch Name</th>
              <th className="pb-3">Region</th>
              <th className="pb-3">Manager</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-50">
              <td className="py-4 font-medium">Vertex NA-East</td>
              <td className="py-4 text-gray-500">New York, USA</td>
              <td className="py-4">Sarah Jenkins</td>
              <td className="py-4"><span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">Active</span></td>
            </tr>
            <tr className="border-b border-gray-50">
              <td className="py-4 font-medium">Vertex EU-Central</td>
              <td className="py-4 text-gray-500">Berlin, Germany</td>
              <td className="py-4">Marcus Weber</td>
              <td className="py-4"><span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">Active</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrganizationDashboard;
