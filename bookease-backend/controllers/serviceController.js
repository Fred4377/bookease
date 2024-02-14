const Service = require('../models/Service');

// @desc    Get all active services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    // Return all services so admin can toggle active/inactive status
    const services = await Service.find({});
    res.json(services);
  } catch (error) {
    console.error('Get services error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new service
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res) => {
  const { name, duration, price, description } = req.body;

  try {
    const service = await Service.create({
      name,
      duration,
      price,
      description,
      isActive: true
    });

    res.status(201).json(service);
  } catch (error) {
    console.error('Create service error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
  const { name, duration, price, description, isActive } = req.body;

  try {
    const service = await Service.findById(req.params.id);

    if (service) {
      service.name = name !== undefined ? name : service.name;
      service.duration = duration !== undefined ? duration : service.duration;
      service.price = price !== undefined ? price : service.price;
      service.description = description !== undefined ? description : service.description;
      service.isActive = isActive !== undefined ? isActive : service.isActive;

      const updatedService = await service.save();
      res.json(updatedService);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    console.error('Update service error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (service) {
      await Service.deleteOne({ _id: req.params.id });
      res.json({ message: 'Service removed successfully' });
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    console.error('Delete service error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService
};
