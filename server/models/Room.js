const mongoose = require('mongoose');

const furnitureItemSchema = new mongoose.Schema({
  _id: { type: String },
  furnitureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Furniture' },
  name: String,
  category: String,
  price: Number,
  color: String,
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  rotation: { type: Number, default: 0 },
  width: Number,
  depth: Number,
  height: Number
}, { _id: false });

const roomSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true,
    maxlength: 100
  },
  dimensions: {
    width: { type: Number, required: true, min: 1 },
    length: { type: Number, required: true, min: 1 },
    height: { type: Number, required: true, min: 1 }
  },
  furniture: [furnitureItemSchema],
  totalCost: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

roomSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Room', roomSchema);
