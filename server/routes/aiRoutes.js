const express = require('express');
const router = express.Router();
const { getDesignSuggestions } = require('../controllers/aiController');
const auth = require('../middleware/auth');

router.post('/', auth, getDesignSuggestions);

module.exports = router;
