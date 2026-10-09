const Item = require('../models/Item');

// @desc    Get all items (with optional filters)
// @route   GET /api/items
// @access  Public
exports.getItems = async (req, res) => {
  try {
    const { search, type, category, status } = req.query;
    
    // Build query object
    let query = {};
    
    // Filtering
    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;
    
    // Searching
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await Item.find(query)
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
exports.getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('user', 'fullName email');

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create new item
// @route   POST /api/items
// @access  Private
exports.createItem = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const item = await Item.create(req.body);

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
exports.updateItem = async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    // Make sure user owns item
    if (item.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'User not authorized to update this item' });
    }

    item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    // Make sure user owns item
    if (item.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'User not authorized to delete this item' });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Mark item as resolved
// @route   PATCH /api/items/:id/resolve
// @access  Private
exports.resolveItem = async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    // Make sure user owns item
    if (item.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'User not authorized to update this item' });
    }

    item.status = 'resolved';
    await item.save();

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
