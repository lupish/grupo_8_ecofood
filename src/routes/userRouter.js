const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
//LOGIN
router.get('/login', userController.login);
router.post('/login', userController.login);
//REGISTER
router.get('/register', userController.register);
router.post('/register', userController.createAcount);

module.exports = router;