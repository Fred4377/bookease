import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';

const AdminBookings = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  
  // Filter States
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/bookings');
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    if (!window.confirm(`Are you sure you want to mark this booking as ${status}?`)) {
      return;
    }
    try {
      setLoading(true);
      await api.patch(`/bookings/${id}/status`, { status });
      await fetchBookings();
    } catch (error) {
      console.error('Error updating status:', error.message);
      alert('Failed to update status.');
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('WARNING: Are you sure you want to permanently delete this booking? This action cannot be undone.')) {
      return;
    }
    try {
      setLoading(true);
      await api.delete(`/bookings/${id}`);
      await fetchBookings();
    } catch (error) {
      console.error('Error deleting booking:', error.message);
      alert('Failed to delete booking.');
      setLoading(false);
    }
  };

  // Client-side filtering logic
  const filteredBookings = bookings.filter((b) => {
    // 1. Status Filter
    if (statusFilter !== 'All' && b.status !== statusFilter.toLowerCase()) {
      return false;
    }

    // 2. Date Filter
    if (dateFilter) {
      const bDateStr = new Date(b.bookingDate).toLocaleDateString('sv-SE'); // YYYY-MM-DD
      if (bDateStr !== dateFilter) {
        return false;
      }
    }

    // 3. Search Query (Matches Name, Email, Phone)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const nameMatch = b.customerName?.toLowerCase().includes(query);
      const emailMatch = b.customerEmail?.toLowerCase().includes(query);
      const phoneMatch = b.customerPhone?.includes(query);
      const idMatch = b._id?.toLowerCase().includes(query);
      
      if (!nameMatch && !emailMatch && !phoneMatch && !idMatch) {
        return false;
      }
    }

    return true;
  });

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Appointments Ledger</h1>
            <p className="text-sm text-[#E6EDF3]/50">Manage booking slots status, cancellations, and completed records.</p>
          </div>
          <button
            onClick={fetchBookings}
            className="self-start sm:self-auto bg-[#0D1117] text-[#E6EDF3] border border-gray-850 hover:border-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-all flex items-center justify-center"
          >
            <i className="fas fa-sync-alt mr-2 text-primary"></i> Refresh
          </button>
        </div>

        {/* Filter Toolbar Card */}
        <div className="bg-[#161B22] border border-gray-800/60 p-5 rounded-2xl shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search Query */}
            <div>
              <label htmlFor="search" className="block text-xs font-semibold text-[#E6EDF3]/50 uppercase tracking-wider mb-2">
                Search Customer / ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Name, email, phone..."
                  className="w-full bg-[#0D1117] border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm text-[#E6EDF3] placeholder-gray-650 focus:outline-none focus:border-primary"
                />
                <i className="fas fa-search absolute left-3.5 top-3 text-[#E6EDF3]/30 text-sm"></i>
              </div>
            </div>

            {/* Status Dropdown */}
            <div>
              <label htmlFor="status" className="block text-xs font-semibold text-[#E6EDF3]/50 uppercase tracking-wider mb-2">
                Filter by Status
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-[#0D1117] border border-gray-800 rounded-xl px-4 py-2 text-sm text-[#E6EDF3] focus:outline-none focus:border-primary appearance-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label htmlFor="date" className="block text-xs font-semibold text-[#E6EDF3]/50 uppercase tracking-wider mb-2">
                Filter by Date
              </label>
              <input
                type="date"
                id="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full bg-[#0D1117] border border-gray-800 rounded-xl px-4 py-2 text-sm text-[#E6EDF3] focus:outline-none focus:border-primary cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Table List View */}
        <div className="bg-[#161B22] border border-gray-800/60 rounded-2xl shadow-lg overflow-hidden">
          {loading && bookings.length === 0 ? (
            <Loader />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800/40 text-sm text-left">
                <thead>
                  <tr className="text-[#E6EDF3]/40 text-xs uppercase font-semibold">
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Customer</th>
                    <th className="py-4 px-6">Service</th>
                    <th className="py-4 px-6">Date & Time</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/30 text-[#E6EDF3]">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-[#E6EDF3]/40">
                        <i className="fas fa-filter block text-3xl mb-3 text-gray-700"></i>
                        No bookings match the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b._id} className="hover:bg-[#0D1117]/10 transition-colors">
                        <td className="py-4 px-6 font-mono text-xs text-[#E6EDF3]/50">
                          {b._id.substring(0, 8)}...
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-white">{b.customerName}</div>
                          <div className="text-xs text-[#E6EDF3]/50 mt-0.5">{b.customerEmail}</div>
                          <div className="text-[10px] text-[#E6EDF3]/40 mt-0.5">{b.customerPhone}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-white">{b.serviceName}</div>
                          <span className="text-[10px] text-primary font-bold">${b.servicePrice}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium text-white">{formatDate(b.bookingDate)}</div>
                          <div className="text-xs text-success font-semibold mt-0.5">{b.timeSlot}</div>
                        </td>
                        <td className="py-4 px-6">
                          <StatusBadge status={b.status} />
                        </td>
                        <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                          {b.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(b._id, 'confirmed')}
                              className="p-1.5 px-3 rounded-lg bg-success/15 text-success hover:bg-success hover:text-white transition-all text-xs font-bold"
                            >
                              Confirm
                            </button>
                          )}
                          {b.status === 'confirmed' && (
                            <button
                              onClick={() => handleUpdateStatus(b._id, 'completed')}
                              className="p-1.5 px-3 rounded-lg bg-[#8B5CF6]/15 text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white transition-all text-xs font-bold"
                            >
                              Complete
                            </button>
                          )}
                          {b.status !== 'cancelled' && b.status !== 'completed' && (
                            <button
                              onClick={() => handleUpdateStatus(b._id, 'cancelled')}
                              className="p-1.5 px-3 rounded-lg bg-[#EF4444]/15 text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all text-xs font-bold"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteBooking(b._id)}
                            className="p-1.5 px-2 rounded-lg bg-gray-800/60 text-gray-400 hover:bg-[#EF4444] hover:text-white transition-all text-xs"
                            title="Delete Permanently"
                          >
                            <i className="far fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
