const express = require('express');
const router = express.Router();

const panelController = require('../controllers/panelController');

// Admin
router.get('/manageEcoFood', panelController.manageEcoFood);
router.get('/manageProducts', panelController.manageProducts);
router.get('/manageBrands', panelController.manageBrands);

module.exports = router;