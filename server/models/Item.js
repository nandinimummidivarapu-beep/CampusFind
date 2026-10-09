const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an item title'],
    trim: true,
    maxlength: 100,
  },
  type: {
    type: String,
    required: [true, 'Please specify if the item is lost or found'],
    enum: ['lost', 'found'],
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['ID Card', 'Books', 'Electronics', 'Bags', 'Keys', 'Water Bottles', 'Accessories', 'Other'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: 1000,
  },
  location: {
    type: String,
    required: [true, 'Please provide the location where the item was lost/found'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide the date when the item was lost/found'],
  },
  imageUrl: {
    type: String,
    default: '', // Fallback handled on frontend if empty
  },
  contactMethod: {
    type: String,
    required: [true, 'Please provide a way for students to contact you (e.g., phone, email, dorm room)'],
  },
  status: {
    type: String,
    enum: ['open', 'resolved'],
    default: 'open',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Item', itemSchema);
