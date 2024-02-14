import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';
import Loader from '../../components/Loader';

const AdminServices = () => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [duration, setDuration] = useState(30);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  const [formError, setFormError] = useState('');

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/services');
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedServiceId(null);
    setName('');
    setDuration(30);
    setPrice(0);
    setDescription('');
    setIsActive(true);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setIsEditMode(true);
    setSelectedServiceId(service._id);
    setName(service.name);
    setDuration(service.duration);
    setPrice(service.price);
    setDescription(service.description || '');
    setIsActive(service.isActive);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleToggleActive = async (service) => {
    try {
      setLoading(true);
      await api.put(`/services/${service._id}`, {
        isActive: !service.isActive
      });
      await fetchServices();
    } catch (error) {
      console.error('Error toggling service status:', error.message);
      alert('Failed to change status.');
      setLoading(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service? Bookings using this service will remain, but customers won\'t be able to book it again.')) {
      return;
    }
    try {
      setLoading(true);
      await api.delete(`/services/${id}`);
      await fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error.message);
      alert('Failed to delete service.');
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !duration) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const payload = {
      name,
      duration: Number(duration),
      price: Number(price),
      description,
      isActive
    };

    try {
      setLoading(true);
      if (isEditMode) {
        await api.put(`/services/${selectedServiceId}`, payload);
      } else {
        await api.post('/services', payload);
      }
      setIsModalOpen(false);
      await fetchServices();
    } catch (error) {
      console.error('Error saving service:', error.message);
      setFormError(error.response?.data?.message || 'Failed to save service.');
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Services Directory</h1>
            <p className="text-sm text-[#E6EDF3]/50">Add, edit, or toggle active status of BookEase business services.</p>
          </div>
          <button
            onClick={openAddModal}
            className="self-start sm:self-auto bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-primary/15"
          >
            <i className="fas fa-plus mr-2"></i> Add New Service
          </button>
        </div>

        {/* Services Table View */}
        <div className="bg-[#161B22] border border-gray-800/60 rounded-2xl shadow-lg overflow-hidden">
          {loading && services.length === 0 ? (
            <Loader />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800/40 text-sm text-left">
                <thead>
                  <tr className="text-[#E6EDF3]/40 text-xs uppercase font-semibold">
                    <th className="py-4 px-6">Service Name</th>
                    <th className="py-4 px-6">Duration</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/30 text-[#E6EDF3]">
                  {services.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-[#E6EDF3]/40">
                        <i className="fas fa-briefcase block text-3xl mb-3 text-gray-700"></i>
                        No services configured yet. Create one above!
                      </td>
                    </tr>
                  ) : (
                    services.map((service) => (
                      <tr key={service._id} className="hover:bg-[#0D1117]/10 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-white">{service.name}</div>
                          <div className="text-xs text-[#E6EDF3]/50 mt-0.5 max-w-sm truncate">
                            {service.description || 'No description provided.'}
                          </div>
                        </td>
                        <td className="py-4 px-6 font-medium text-white">
                          <i className="far fa-clock mr-1.5 text-gray-500"></i> {service.duration} mins
                        </td>
                        <td className="py-4 px-6 font-extrabold text-primary text-base">
                          ${service.price}
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => handleToggleActive(service)}
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider cursor-pointer border transition-all ${
                              service.isActive
                                ? 'bg-success/15 text-success border-success/30 hover:bg-success/25'
                                : 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30 hover:bg-[#EF4444]/25'
                            }`}
                            title={`Click to mark as ${service.isActive ? 'Inactive' : 'Active'}`}
                          >
                            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current"></span>
                            {service.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => openEditModal(service)}
                            className="p-2 px-3 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold"
                          >
                            <i className="far fa-edit mr-1"></i> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteService(service._id)}
                            className="p-2 px-3 rounded-lg bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all text-xs font-bold"
                          >
                            <i className="far fa-trash-alt mr-1"></i> Delete
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

        {/* Modal form overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-[#0D1117]/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#161B22] border border-gray-800/80 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center bg-[#0D1117]/40 px-6 py-4 border-b border-gray-800/80">
                <h3 className="text-lg font-bold text-white">
                  {isEditMode ? 'Modify Service Details' : 'Add New Business Service'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-white text-lg focus:outline-none"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                {formError && (
                  <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-xl p-3.5 text-xs flex items-center">
                    <i className="fas fa-exclamation-circle mr-2 text-sm"></i>
                    {formError}
                  </div>
                )}

                <div>
                  <label htmlFor="serviceName" className="block text-xs font-semibold text-[#E6EDF3]/60 uppercase tracking-wider mb-1">
                    Service Name <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="text"
                    id="serviceName"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Haircut & Wash"
                    className="w-full bg-[#0D1117] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-[#E6EDF3] placeholder-gray-600 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="serviceDuration" className="block text-xs font-semibold text-[#E6EDF3]/60 uppercase tracking-wider mb-1">
                      Duration (Mins) <span className="text-[#EF4444]">*</span>
                    </label>
                    <select
                      id="serviceDuration"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full bg-[#0D1117] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-[#E6EDF3] focus:outline-none focus:border-primary cursor-pointer"
                    >
                      <option value={30}>30 mins</option>
                      <option value={45}>45 mins</option>
                      <option value={60}>60 mins</option>
                      <option value={90}>90 mins</option>
                      <option value={120}>120 mins</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="servicePrice" className="block text-xs font-semibold text-[#E6EDF3]/60 uppercase tracking-wider mb-1">
                      Price ($ USD) <span className="text-[#EF4444]">*</span>
                    </label>
                    <input
                      type="number"
                      id="servicePrice"
                      required
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      placeholder="e.g. 15.00"
                      className="w-full bg-[#0D1117] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-[#E6EDF3] placeholder-gray-600 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="serviceDesc" className="block text-xs font-semibold text-[#E6EDF3]/60 uppercase tracking-wider mb-1">
                    Service Description
                  </label>
                  <textarea
                    id="serviceDesc"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the service and tools used..."
                    className="w-full bg-[#0D1117] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-[#E6EDF3] placeholder-gray-600 focus:outline-none focus:border-primary resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <input
                    type="checkbox"
                    id="serviceActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-850 bg-[#0D1117] text-primary focus:ring-primary"
                  />
                  <label htmlFor="serviceActive" className="text-sm font-semibold text-white select-none cursor-pointer">
                    Service is Active and displayable
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800/40">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-800 text-sm font-semibold hover:bg-gray-800/60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg active:scale-95 transition-all"
                  >
                    {isEditMode ? 'Save Changes' : 'Create Service'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminServices;
