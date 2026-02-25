const Furniture = require('../models/Furniture');

exports.getAllFurniture = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const furniture = await Furniture.find(filter).sort({ category: 1, name: 1 });
    res.json(furniture);
  } catch (error) {
    next(error);
  }
};

exports.getFurnitureById = async (req, res, next) => {
  try {
    const furniture = await Furniture.findById(req.params.id);
    if (!furniture) return res.status(404).json({ message: 'Furniture not found' });
    res.json(furniture);
  } catch (error) {
    next(error);
  }
};
