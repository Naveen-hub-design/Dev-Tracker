const Certificate = require('../models/Certificate');

const SAMPLE_CERTS = [
  {
    name: 'AWS Cloud Practitioner',
    organization: 'AWS',
    category: 'AWS',
    issueDate: '2025-06-15',
    expiryDate: '2028-06-15',
    credentialId: 'AWS-CP-2025-XXXXX',
    verifyUrl: 'https://aws.amazon.com/verification',
    image: null,
    notes: 'Foundational cloud knowledge certification.',
  },
  {
    name: 'Google Data Analytics',
    organization: 'Google',
    category: 'Google',
    issueDate: '2025-09-20',
    expiryDate: '',
    credentialId: 'GDA-2025-YYYYY',
    verifyUrl: 'https://coursera.org/verify',
    image: null,
    notes: 'Professional data analytics specialization.',
  },
  {
    name: 'Python for Everybody',
    organization: 'Coursera',
    category: 'Coursera',
    issueDate: '2025-03-10',
    expiryDate: '',
    credentialId: 'PFE-2025-ZZZZZ',
    verifyUrl: 'https://coursera.org/verify',
    image: null,
    notes: 'University of Michigan Python specialization.',
  },
  {
    name: 'React - The Complete Guide',
    organization: 'Udemy',
    category: 'Udemy',
    issueDate: '2025-01-05',
    expiryDate: '',
    credentialId: 'UDM-REACT-001',
    verifyUrl: 'https://udemy.com/certificate',
    image: null,
    notes: 'Comprehensive React course by Maximilian.',
  },
];

const getCertificates = async (req, res) => {
  try {
    const userId = req.user._id;
    let certs = await Certificate.find({ userId });

    if (certs.length === 0) {
      for (const sample of SAMPLE_CERTS) {
        await Certificate.create({ ...sample, userId });
      }
      certs = await Certificate.find({ userId });
    }

    res.json(certs);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching certificates' });
  }
};

const createCertificate = async (req, res) => {
  try {
    const userId = req.user._id;
    const cert = await Certificate.create({
      ...req.body,
      userId,
    });
    res.status(201).json(cert);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error creating certificate' });
  }
};

const updateCertificate = async (req, res) => {
  try {
    const updated = await Certificate.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body
    );
    if (!updated) return res.status(404).json({ message: 'Certificate not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating certificate' });
  }
};

const deleteCertificate = async (req, res) => {
  try {
    const result = await Certificate.deleteOne({ _id: req.params.id, userId: req.user._id });
    if (result.changes === 0) return res.status(404).json({ message: 'Certificate not found' });
    res.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error deleting certificate' });
  }
};

module.exports = {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
};
