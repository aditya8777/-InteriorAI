const mongoose = require('mongoose');

const furnitureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Furniture name is required'],
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['sofa', 'chair', 'table', 'bed', 'decor', 'storage', 'lighting']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  dimensions: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    depth: { type: Number, required: true }
  },
  colorOptions: [String],
  description: String
});

module.exports = mongoose.model('Furniture', furnitureSchema);
