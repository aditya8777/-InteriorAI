const Room = require('../models/Room');

exports.getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

exports.getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findOne({ _id: req.params.id, userId: req.user.id });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (error) {
    next(error);
  }
};

exports.createRoom = async (req, res, next) => {
  try {
    const { name, dimensions, furniture } = req.body;

    if (!name || !dimensions) {
      return res.status(400).json({ message: 'Name and dimensions are required' });
    }

    const totalCost = (furniture || []).reduce((sum, item) => sum + (item.price || 0), 0);

    const room = await Room.create({
      userId: req.user.id,
      name,
      dimensions,
      furniture: furniture || [],
      totalCost
    });

    res.status(201).json(room);
  } catch (error) {
    next(error);
  }
};

exports.updateRoom = async (req, res, next) => {
  try {
    const { name, dimensions, furniture } = req.body;

    const room = await Room.findOne({ _id: req.params.id, userId: req.user.id });
    if (!room) return res.status(404).json({ message: 'Room not found' });

    if (name) room.name = name;
    if (dimensions) room.dimensions = dimensions;
    if (furniture !== undefined) {
      room.furniture = furniture;
      room.totalCost = furniture.reduce((sum, item) => sum + (item.price || 0), 0);
    }

    await room.save();
    res.json(room);
  } catch (error) {
    next(error);
  }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    next(error);
  }
};
