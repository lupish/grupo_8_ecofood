const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

//CONTROLADOR
const userController = require('../controllers/userController');

//RUTAS

//LOGIN
router.get('/login', userController.login);
router.post('/login', userController.processLogin);
//REGISTER
router.get('/register', userController.register);
router.post('/register', userController.processRegister);

//ADMIN
router.get('/manageUsers', userController.manageUsers);

//DETaLLE DE USUARIO
router.get('/userDetail/:id', userController.userDetail);

//EDICION DE ROL 
router.get('/edit/:id', userController.edit);
router.put('/edit/:id', userController.processEdit);

//ELIMINACION DE USUARIOS 
router.delete('/delete/soft/:id', userController.softDelete);
router.delete('/delete/hard/:id', userController.hardDelete);

//REACTIVAR USURAIO
router.patch('/activar/:id', userController.processActivate);

module.exports = router;