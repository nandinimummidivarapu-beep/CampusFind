const Item = require('../models/Item');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Public
exports.getStats = async (req, res) => {
  try {
    const totalReports = await Item.countDocuments();
    const lostReports = await Item.countDocuments({ type: 'lost' });
    const foundReports = await Item.countDocuments({ type: 'found' });
    const resolvedReports = await Item.countDocuments({ status: 'resolved' });

    res.status(200).json({
      success: true,
      data: {
        totalReports,
        lostReports,
        foundReports,
        resolvedReports,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
