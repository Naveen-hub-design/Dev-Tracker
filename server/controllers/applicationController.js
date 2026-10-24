const Application = require('../models/Application');

const VALID_STATUSES = ['wishlist', 'applied', 'interviewing', 'offer', 'rejected'];

const getApplications = async (req, res, next) => {
  try {
    const applications = await Application.find(
      { userId: req.user._id },
      { sort: 'updatedAt DESC' }
    );
    res.json(applications || []);
  } catch (error) {
    next(error);
  }
};

const createApplication = async (req, res, next) => {
  try {
    const {
      company,
      role,
      location = '',
      status = 'applied',
      salary = '',
      jobUrl = '',
      jobDescription = '',
      atsScore = 0,
      appliedDate = new Date().toISOString(),
      interviewDate = '',
      notes = '',
      contacts = [],
    } = req.body;

    if (!company || !company.trim()) {
      return res.status(400).json({ message: 'Company name is required' });
    }
    if (!role || !role.trim()) {
      return res.status(400).json({ message: 'Job role is required' });
    }

    const application = await Application.create({
      userId: req.user._id,
      company: company.trim(),
      role: role.trim(),
      location: location.trim(),
      status: VALID_STATUSES.includes(status) ? status : 'applied',
      salary: salary.trim(),
      jobUrl: jobUrl.trim(),
      jobDescription: jobDescription.trim(),
      atsScore: Number(atsScore) || 0,
      appliedDate: appliedDate || new Date().toISOString(),
      interviewDate: interviewDate ? interviewDate.trim() : '',
      notes: notes.trim(),
      contacts: Array.isArray(contacts) ? contacts : [],
    });

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

const updateApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await Application.findById(id);

    if (!existing || existing.userId !== req.user._id) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const updateData = {};
    const allowed = [
      'company',
      'role',
      'location',
      'status',
      'salary',
      'jobUrl',
      'jobDescription',
      'atsScore',
      'appliedDate',
      'interviewDate',
      'notes',
      'contacts',
    ];

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'status' && !VALID_STATUSES.includes(req.body[field])) {
          return;
        }
        updateData[field] = req.body[field];
      }
    });

    updateData.updatedAt = new Date().toISOString();

    const updated = await Application.findOneAndUpdate({ _id: id, userId: req.user._id }, updateData);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const existing = await Application.findById(id);
    if (!existing || existing.userId !== req.user._id) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const updated = await Application.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { status, updatedAt: new Date().toISOString() }
    );

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await Application.findById(id);

    if (!existing || existing.userId !== req.user._id) {
      return res.status(404).json({ message: 'Application not found' });
    }

    await Application.deleteOne({ _id: id, userId: req.user._id });
    res.json({ message: 'Application removed successfully', id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApplications,
  createApplication,
  updateApplication,
  updateStatus,
  deleteApplication,
};
