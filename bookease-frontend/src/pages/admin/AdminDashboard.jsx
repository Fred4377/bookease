import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0
  });
  const [todaysBookings, setTodaysBookings] = useState([]);
  const [chartDataState, setChartDataState] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const { data } = await api.get('/bookings');
      setBookings(data);

      // Process Stats
      const total = data.length;
      const pending = data.filter((b) => b.status === 'pending').length;
      const confirmed = data.filter((b) => b.status === 'confirmed').length;
      const completed = data.filter((b) => b.status === 'completed').length;
      setStats({ total, pending, confirmed, completed });

      // Process Today's Bookings
      // Get today's local date string YYYY-MM-DD
      const todayStr = new Date().toLocaleDateString('sv-SE'); // returns YYYY-MM-DD
      const todayList = data.filter((b) => {
        const bDateStr = new Date(b.bookingDate).toLocaleDateString('sv-SE');
        return bDateStr === todayStr;
      });
      setTodaysBookings(todayList);

      // Process Chart Data (Last 7 Days)
      const labels = [];
      const counts = [];
      const dateMap = {};

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateString = d.toLocaleDateString('sv-SE'); // YYYY-MM-DD
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        labels.push(label);
        dateMap[dateString] = 0;
      }

      data.forEach((b) => {
        const bDateStr = new Date(b.bookingDate).toLocaleDateString('sv-SE');
        if (dateMap[bDateStr] !== undefined) {
          dateMap[bDateStr]++;
        }
      });

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateString = d.toLocaleDateString('sv-SE');
        counts.push(dateMap[dateString]);
      }

      setChartDataState({
        labels,
        datasets: [
          {
            fill: true,
            label: 'Bookings Count',
            data: counts,
            borderColor: '#0d6efd',
            backgroundColor: 'rgba(30, 144, 255, 0.1)',
            tension: 0.4,
            pointBackgroundColor: '#0d6efd',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#0d6efd'
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    if (!window.confirm(`Are you sure you want to mark this booking as ${status}?`)) {
      return;
    }
    try {
      setLoading(true);
      await api.patch(`/bookings/${id}/status`, { status });
      await fetchDashboardData();
    } catch (error) {
      console.error('Error updating status:', error.message);
      alert('Failed to update status.');
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#161B22',
        titleColor: '#fff',
        bodyColor: '#E6EDF3',
        borderColor: '#0d6efd',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(230, 237, 243, 0.05)'
        },
        ticks: {
          color: 'rgba(230, 237, 243, 0.5)',
          precision: 0
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(230, 237, 243, 0.5)'
        }
      }
    }
  };

  if (loading && bookings.length === 0) {
    return (
      <AdminLayout>
        <Loader fullPage={false} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-[#E6EDF3]/50">Overview of booking operations, statistics and activity.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#161B22] border border-gray-800/60 p-6 rounded-2xl flex items-center space-x-4 shadow-lg">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl">
              <i className="far fa-calendar-alt"></i>
            </div>
            <div>
              <span className="text-xs text-[#E6EDF3]/40 uppercase tracking-wider block">Total Bookings</span>
              <span className="text-2xl font-bold text-white">{stats.total}</span>
            </div>
          </div>

          <div className="bg-[#161B22] border border-gray-800/60 p-6 rounded-2xl flex items-center space-x-4 shadow-lg">
            <div className="w-12 h-12 bg-[#F59E0B]/10 text-[#F59E0B] rounded-xl flex items-center justify-center text-xl">
              <i className="fas fa-hourglass-half"></i>
            </div>
            <div>
              <span className="text-xs text-[#E6EDF3]/40 uppercase tracking-wider block">Pending</span>
              <span className="text-2xl font-bold text-[#F59E0B]">{stats.pending}</span>
            </div>
          </div>

          <div className="bg-[#161B22] border border-gray-800/60 p-6 rounded-2xl flex items-center space-x-4 shadow-lg">
            <div className="w-12 h-12 bg-success/10 text-success rounded-xl flex items-center justify-center text-xl">
              <i className="fas fa-check-circle"></i>
            </div>
            <div>
              <span className="text-xs text-[#E6EDF3]/40 uppercase tracking-wider block">Confirmed</span>
              <span className="text-2xl font-bold text-success">{stats.confirmed}</span>
            </div>
          </div>

          <div className="bg-[#161B22] border border-gray-800/60 p-6 rounded-2xl flex items-center space-x-4 shadow-lg">
            <div className="w-12 h-12 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-xl flex items-center justify-center text-xl">
              <i className="fas fa-history"></i>
            </div>
            <div>
              <span className="text-xs text-[#E6EDF3]/40 uppercase tracking-wider block">Completed</span>
              <span className="text-2xl font-bold text-[#8B5CF6]">{stats.completed}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Visualizations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's appointments Table */}
          <div className="lg:col-span-2 bg-[#161B22] border border-gray-800/60 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Today's Appointments</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800/40 text-sm">
                  <thead>
                    <tr className="text-left text-[#E6EDF3]/40 text-xs uppercase font-semibold">
                      <th className="pb-3 pr-4">Time</th>
                      <th className="pb-3 px-4">Customer</th>
                      <th className="pb-3 px-4">Service</th>
                      <th className="pb-3 px-4">Status</th>
                      <th className="pb-3 pl-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/30 text-[#E6EDF3]">
                    {todaysBookings.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-[#E6EDF3]/40">
                          <i className="far fa-smile block text-2xl mb-2 text-gray-700"></i>
                          No bookings scheduled for today.
                        </td>
                      </tr>
                    ) : (
                      todaysBookings.map((b) => (
                        <tr key={b._id} className="hover:bg-[#0D1117]/10">
                          <td className="py-3.5 pr-4 font-semibold text-white">{b.timeSlot}</td>
                          <td className="py-3.5 px-4 font-medium">
                            <div>{b.customerName}</div>
                            <span className="text-[10px] text-[#E6EDF3]/40 block mt-0.5">{b.customerPhone}</span>
                          </td>
                          <td className="py-3.5 px-4 text-primary font-semibold">{b.serviceName}</td>
                          <td className="py-3.5 px-4">
                            <StatusBadge status={b.status} />
                          </td>
                          <td className="py-3.5 pl-4 text-right space-x-2">
                            {b.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(b._id, 'confirmed')}
                                  title="Confirm Appointment"
                                  className="p-1 px-2.5 rounded bg-success/15 text-success hover:bg-success hover:text-white transition-all text-xs font-bold"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(b._id, 'cancelled')}
                                  title="Cancel Appointment"
                                  className="p-1 px-2.5 rounded bg-[#EF4444]/15 text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all text-xs font-bold"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            {b.status === 'confirmed' && (
                              <button
                                onClick={() => handleUpdateStatus(b._id, 'completed')}
                                title="Mark Completed"
                                className="p-1 px-2.5 rounded bg-[#8B5CF6]/15 text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white transition-all text-xs font-bold"
                              >
                                Complete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Booking Analytics Chart */}
          <div className="lg:col-span-1 bg-[#161B22] border border-gray-800/60 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Weekly Performance</h3>
              <p className="text-xs text-[#E6EDF3]/40 mb-6">Booking count trends for the last 7 calendar days.</p>
              
              <div className="h-64 relative">
                {chartDataState ? (
                  <Line data={chartDataState} options={chartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Loader size="small" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
