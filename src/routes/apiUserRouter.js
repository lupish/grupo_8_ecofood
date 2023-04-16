const express = require('express');
const router = express.Router();

// CONTROLLER
const userController = require('../controllers/apiUserController');
const adminPermission = require('../middlewares/adminPermission');

// RUTAS

router.get('/', userController.listUsers);
router.get('/:id', userController.userDetail);


module.exports = router;