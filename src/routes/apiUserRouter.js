const express = require('express');
const router = express.Router();
const path = require('path');

//MIDDLEWARES
const guestMiddleware = require('../middlewares/guestMiddleware');
const authMiddleware= require('../middlewares/authMiddleware');
const adminPermission = require('../middlewares/adminPermission');

//CONTROLADOR
const userController = require('../controllers/apiUserController');

//RUTAS

router.get('/listUsers', userController.listUsers);


module.exports = router;