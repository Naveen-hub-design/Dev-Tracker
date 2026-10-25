const { fetchCodeChefData, getDemoData, CODECHEF_ERRORS } = require('../services/codeChefService');
const User = require('../models/User');

const getCodeChefProfile = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ message: 'CodeChef handle is required' });
    }

    try {
      const data = await fetchCodeChefData(username);
      return res.json(data);
    } catch (err) {
      if (err.message === CODECHEF_ERRORS.NOT_FOUND) {
        return res.status(404).json({ message: 'CodeChef user not found' });
      }
      if (err.message === CODECHEF_ERRORS.INVALID_USERNAME) {
        return res.status(400).json({ message: err.message });
      }
      if (err.message === CODECHEF_ERRORS.TIMEOUT || err.message === CODECHEF_ERRORS.UNAVAILABLE) {
        return res.status(503).json({ message: err.message });
      }
      return res.status(500).json({ message: 'Error fetching CodeChef data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Unexpected server error' });
  }
};

const getMyCodeChef = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.codeChefData) {
      return res.json(user.codeChefData);
    }

    if (user.codeChefUsername) {
      try {
        const fresh = await fetchCodeChefData(user.codeChefUsername);
        await User.findOneAndUpdate({ _id: user._id }, { codeChefData: fresh });
        return res.json(fresh);
      } catch (err) {
        console.warn('Could not fetch fresh CodeChef data:', err.message);
        if (err.message === CODECHEF_ERRORS.NOT_FOUND) {
          return res.status(404).json({ message: 'Connected CodeChef user not found' });
        }
      }
    }

    return res.json(null);
  } catch (error) {
    res.status(500).json({ message: 'Error loading CodeChef profile' });
  }
};

const updateCodeChefUsername = async (req, res) => {
  try {
    const rawUsername = req.body.codeChefUsername !== undefined
      ? req.body.codeChefUsername
      : req.body.username;

    if (rawUsername === undefined) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const clean = typeof rawUsername === 'string' ? rawUsername.trim() : '';

    if (!clean) {
      // Unlink CodeChef
      await User.findOneAndUpdate(
        { _id: req.user._id },
        { codeChefUsername: '', codeChefData: null }
      );
      return res.json({ message: 'CodeChef unlinked successfully', connected: false });
    }

    // Validate and fetch data for the new handle
    let data;
    try {
      data = await fetchCodeChefData(clean, true);
    } catch (err) {
      if (err.message === CODECHEF_ERRORS.NOT_FOUND) {
        return res.status(404).json({ message: 'CodeChef handle does not exist' });
      }
      if (err.message === CODECHEF_ERRORS.INVALID_USERNAME) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(503).json({ message: 'Unable to verify CodeChef handle right now. Please try again later.' });
    }

    await User.findOneAndUpdate(
      { _id: req.user._id },
      { codeChefUsername: clean, codeChefData: data }
    );

    return res.json({
      message: 'CodeChef connected successfully',
      codeChefUsername: clean,
      codeChefData: data,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating CodeChef username' });
  }
};

const refreshCodeChef = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.codeChefUsername) {
      return res.status(400).json({ message: 'No CodeChef username set. Please link one in Settings.' });
    }

    try {
      const fresh = await fetchCodeChefData(user.codeChefUsername, true);
      await User.findOneAndUpdate({ _id: user._id }, { codeChefData: fresh });
      return res.json(fresh);
    } catch (err) {
      if (err.message === CODECHEF_ERRORS.NOT_FOUND) {
        return res.status(404).json({ message: 'CodeChef user not found' });
      }
      if (user.codeChefData) {
        // Return stale data gracefully with warning
        return res.json({ ...user.codeChefData, _stale: true, _warning: err.message });
      }
      return res.status(503).json({ message: 'CodeChef service temporarily unavailable' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error refreshing CodeChef data' });
  }
};

module.exports = {
  getCodeChefProfile,
  getMyCodeChef,
  updateCodeChefUsername,
  refreshCodeChef,
};
