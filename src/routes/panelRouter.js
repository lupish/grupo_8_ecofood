const express = require('express');
const router = express.Router();
//middleware
const adminPermission = require('../middlewares/adminPermission');

const panelController = require('../controllers/panelController');

// Admin
router.get('/manageEcoFood', adminPermission ,panelController.manageEcoFood);
router.get('/manageProducts', adminPermission ,panelController.manageProducts);
router.get('/manageBrands', adminPermission , panelController.manageBrands);
router.get('/manageLifeStyles', adminPermission , panelController.manageEstilosVida);
router.get('/manageUsers', adminPermission ,panelController.manageUsers);

module.exports = router;