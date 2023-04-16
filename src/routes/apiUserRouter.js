const express = require('express');
const router = express.Router();

// CONTROLLER
const userController = require('../controllers/apiUserController');

// RUTAS

router.get('/listUsers', userController.listUsers);


module.exports = router;