import { useState } from 'react';
import { FiUsers, FiPhoneCall, FiMail, FiTarget, FiActivity } from 'react-icons/fi';

const mockLeads = [
  { id: 1, name: 'Alice Cooper', company: 'TechNova', status: 'New', value: '$12,000' },
  { id: 2, name: 'Bob Marley', company: 'SoundSys', status: 'In Progress', value: '$5,500' },
  { id: 3, name: 'Charlie Sheen', company: 'Winning LLC', status: 'Closed Won', value: '$24,000' },
];

const CRMDashboard = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Customer Relationship Management</h1>
        <p className="text-gray-500">Manage leads, opportunities, and sales pipelines.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Leads', value: '142', icon: <FiUsers /> },
          { label: 'Active Opportunities', value: '45', icon: <FiTarget /> },
          { label: 'Emails Sent', value: '1,240', icon: <FiMail /> },
          { label: 'Calls Made', value: '382', icon: <FiPhoneCall /> },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-xl">
              {stat.icon}
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
              <div className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Sales Pipeline</h2>
          <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium">Add Lead</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm">
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Company</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Value</th>
                <th className="p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {mockLeads.map(lead => (
                <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{lead.name}</td>
                  <td className="p-4 text-gray-500">{lead.company}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      lead.status === 'Closed Won' ? 'bg-green-100 text-green-700' :
                      lead.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4 font-medium">{lead.value}</td>
                  <td className="p-4 text-orange-600 hover:text-orange-700 font-medium cursor-pointer">View</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CRMDashboard;
