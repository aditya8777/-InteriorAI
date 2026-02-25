require('dotenv').config();
const mongoose = require('mongoose');
const Furniture = require('./models/Furniture');

const furnitureData = [
  // Sofas
  {
    name: 'Modern 3-Seater Sofa',
    category: 'sofa',
    price: 1299,
    dimensions: { width: 220, height: 85, depth: 95 },
    colorOptions: ['Charcoal Gray', 'Beige', 'Navy Blue', 'Forest Green'],
    description: 'Contemporary 3-seater sofa with deep cushioning'
  },
  {
    name: 'L-Shape Corner Sofa',
    category: 'sofa',
    price: 1899,
    dimensions: { width: 280, height: 85, depth: 180 },
    colorOptions: ['Light Gray', 'Dark Brown', 'Cream', 'Slate Blue'],
    description: 'Spacious L-shape sofa perfect for large living rooms'
  },
  {
    name: 'Loveseat Sofa',
    category: 'sofa',
    price: 799,
    dimensions: { width: 150, height: 80, depth: 85 },
    colorOptions: ['Rose Pink', 'Dusty Blue', 'Olive Green', 'Ivory'],
    description: 'Compact 2-seater loveseat for cozy spaces'
  },
  // Chairs
  {
    name: 'Accent Armchair',
    category: 'chair',
    price: 449,
    dimensions: { width: 75, height: 90, depth: 80 },
    colorOptions: ['Mustard Yellow', 'Emerald Green', 'Rust Orange', 'Teal'],
    description: 'Stylish accent armchair with wooden legs'
  },
  {
    name: 'Office Ergonomic Chair',
    category: 'chair',
    price: 599,
    dimensions: { width: 65, height: 120, depth: 65 },
    colorOptions: ['Black', 'White', 'Gray'],
    description: 'Ergonomic office chair with lumbar support'
  },
  {
    name: 'Dining Chair Set (4)',
    category: 'chair',
    price: 699,
    dimensions: { width: 45, height: 95, depth: 50 },
    colorOptions: ['White', 'Black', 'Natural Oak', 'Walnut'],
    description: 'Set of 4 modern dining chairs'
  },
  {
    name: 'Recliner Chair',
    category: 'chair',
    price: 899,
    dimensions: { width: 85, height: 105, depth: 95 },
    colorOptions: ['Dark Brown Leather', 'Black Leather', 'Caramel'],
    description: 'Comfortable recliner with footrest'
  },
  // Tables
  {
    name: 'Rectangular Dining Table',
    category: 'table',
    price: 849,
    dimensions: { width: 180, height: 76, depth: 90 },
    colorOptions: ['Natural Oak', 'Walnut', 'White', 'Black Marble'],
    description: '6-person rectangular dining table'
  },
  {
    name: 'Round Coffee Table',
    category: 'table',
    price: 349,
    dimensions: { width: 90, height: 45, depth: 90 },
    colorOptions: ['Glass + Black', 'Marble White', 'Teak Wood', 'Brass Gold'],
    description: 'Modern round coffee table for living room'
  },
  {
    name: 'Study Desk',
    category: 'table',
    price: 499,
    dimensions: { width: 140, height: 76, depth: 70 },
    colorOptions: ['White', 'Oak', 'Walnut', 'Black'],
    description: 'Minimalist study desk with cable management'
  },
  {
    name: 'Side Table',
    category: 'table',
    price: 149,
    dimensions: { width: 45, height: 55, depth: 45 },
    colorOptions: ['White', 'Gold', 'Marble', 'Walnut'],
    description: 'Small side table for bedroom or living room'
  },
  // Beds
  {
    name: 'King Size Platform Bed',
    category: 'bed',
    price: 1599,
    dimensions: { width: 200, height: 120, depth: 220 },
    colorOptions: ['Dark Walnut', 'Light Oak', 'Upholstered Gray', 'White'],
    description: 'Modern king-size platform bed with headboard'
  },
  {
    name: 'Queen Size Bed Frame',
    category: 'bed',
    price: 1199,
    dimensions: { width: 165, height: 115, depth: 215 },
    colorOptions: ['White', 'Beige Linen', 'Charcoal', 'Natural Wood'],
    description: 'Queen-size bed with upholstered headboard'
  },
  {
    name: 'Bunk Bed (Twin)',
    category: 'bed',
    price: 899,
    dimensions: { width: 100, height: 180, depth: 210 },
    colorOptions: ['White', 'Gray', 'Natural Pine'],
    description: 'Kids twin bunk bed with safety rails'
  },
  // Decor
  {
    name: 'Bookshelf Unit',
    category: 'decor',
    price: 399,
    dimensions: { width: 80, height: 180, depth: 30 },
    colorOptions: ['White', 'Black', 'Oak', 'Walnut'],
    description: '5-tier open bookshelf'
  },
  {
    name: 'Floor Lamp',
    category: 'decor',
    price: 189,
    dimensions: { width: 35, height: 165, depth: 35 },
    colorOptions: ['Matte Black', 'Gold', 'Chrome', 'Brass'],
    description: 'Arched floor lamp with linen shade'
  },
  {
    name: 'Area Rug (Large)',
    category: 'decor',
    price: 299,
    dimensions: { width: 240, height: 2, depth: 170 },
    colorOptions: ['Persian Red', 'Nordic Gray', 'Ivory', 'Navy', 'Sage Green'],
    description: 'Hand-loomed area rug for living spaces'
  },
  {
    name: 'TV Console Unit',
    category: 'storage',
    price: 649,
    dimensions: { width: 180, height: 55, depth: 40 },
    colorOptions: ['Walnut', 'White', 'Black', 'Light Gray'],
    description: 'Modern TV console with storage drawers'
  },
  {
    name: 'Wardrobe Cabinet',
    category: 'storage',
    price: 1099,
    dimensions: { width: 200, height: 210, depth: 60 },
    colorOptions: ['White', 'Oak', 'Dark Brown', 'Anthracite'],
    description: '3-door sliding wardrobe with mirror'
  },
  {
    name: 'Dresser with Mirror',
    category: 'storage',
    price: 749,
    dimensions: { width: 120, height: 150, depth: 45 },
    colorOptions: ['White', 'Walnut', 'Light Gray'],
    description: '5-drawer dresser with mounted mirror'
  },
  {
    name: 'Pendant Light Fixture',
    category: 'lighting',
    price: 229,
    dimensions: { width: 40, height: 120, depth: 40 },
    colorOptions: ['Copper', 'Black Matte', 'Gold', 'Chrome'],
    description: 'Modern geometric pendant light'
  },
  {
    name: 'Indoor Plant (Large)',
    category: 'decor',
    price: 89,
    dimensions: { width: 40, height: 120, depth: 40 },
    colorOptions: ['Green', 'Variegated'],
    description: 'Large fiddle leaf or monstera plant with pot'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Furniture.deleteMany({});
    console.log('🗑️  Cleared existing furniture');

    const inserted = await Furniture.insertMany(furnitureData);
    console.log(`✅ Seeded ${inserted.length} furniture items`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
