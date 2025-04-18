import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Clock, LineChart, AlarmClock, Users } from 'lucide-react';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState({ from: new Date('2025-04-07'), to: new Date('2025-04-14') });
  const [comparisonDate, setComparisonDate] = useState(new Date('2025-04-06'));

  const employees = [
    { name: 'Muhammad Hamdan Sulaiman', role: 'Marketing Manager', duration: '14.7h', lates: 1, group: 'Marketing' },
    { name: 'Nagina Afzal', role: 'Software Developer', duration: '23.8h', lates: 0, group: 'Engineering' },
    { name: 'Sarah Johnson', role: 'HR Specialist', duration: '24.2h', lates: 1, group: 'Human Resources' }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Summary Cards */}
        <div className=" py-4">
      <div className="row g-4">
        {/* Total Hours */}
        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center text-muted mb-1">
                <Clock className="text-primary me-2" size={16} /> Total Hours
              </div>
              <h4 className="text-primary fw-bold">62.6h</h4>
            </div>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center text-muted mb-1">
                <LineChart className="text-success me-2" size={16} /> Attendance Rate
              </div>
              <h4 className="text-warning fw-bold d-flex align-items-center">
                50.0%
                <span className="badge bg-warning text-dark ms-2">Needs Improvement</span>
              </h4>
            </div>
          </div>
        </div>

        {/* Punctuality */}
        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center text-muted mb-1">
                <AlarmClock className="text-purple me-2" size={16} /> Punctuality
              </div>
              <h4 className="text-purple fw-bold d-flex align-items-center">
                25.0%
                <span className="badge bg-light text-muted border ms-2">2 late arrivals</span>
              </h4>
              <small className="text-muted">Avg. late by 11 min</small>
            </div>
          </div>
        </div>

        {/* Consistent Employees */}
        <div className="col-md-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center text-muted mb-1">
                <Users className="text-warning me-2" size={16} /> Consistent Employees
              </div>
              <h4 className="text-warning fw-bold">0 of 3</h4>
              <small className="text-muted">Always on time, no absences</small>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Week-over-Week Comparison */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded flex justify-between items-center text-sm sm:text-base">
        <div className="text-yellow-700 font-medium">⚠️ Late Arrivals</div>
        <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">Needs Attention</div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow border space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Employee</label>
            <select className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm">
              <option>All Employees</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
            <select className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm">
              <option>All Groups</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div className="flex gap-2">
              <input type="date" defaultValue="2025-04-07" className="w-full border px-3 py-2 rounded-md" />
              <input type="date" defaultValue="2025-04-14" className="w-full border px-3 py-2 rounded-md" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
            <select className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm">
              <option>Name</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes Filter</label>
          <input type="text" placeholder="Search in notes" className="w-full border px-3 py-2 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Comparison Period</label>
          <input type="date" defaultValue="2025-04-06" className="w-full border px-3 py-2 rounded-md" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-6 border rounded-lg bg-white shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-4">Employee</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Lates</th>
              <th className="p-4">Group</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50 transition">
                <td className="p-4">
                  <p className="font-medium text-gray-900">{emp.name}</p>
                  <p className="text-xs text-gray-500">{emp.role}</p>
                </td>
                <td className="p-4">⏱ {emp.duration}</td>
                <td className="p-4">{emp.lates > 0 ? <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold">{emp.lates}</span> : '0'}</td>
                <td className="p-4">
                  <span className="bg-gray-200 text-xs px-2 py-1 rounded-full">{emp.group}</span>
                </td>
                <td className="p-4 space-x-2">
                  <button className="px-2 py-1 border rounded text-sm">📧</button>
                  <button className="px-2 py-1 border rounded text-sm">💬</button>
                  <button className="px-2 py-1 border rounded text-sm">👁</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50">
          <button className="flex items-center gap-2 text-sm text-gray-700">
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <div className="space-x-2">
            <button className="px-3 py-1 border rounded text-sm">1</button>
            <button className="px-3 py-1 border rounded text-sm">2</button>
            <button className="flex items-center gap-2 px-3 py-1 border rounded text-sm">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
