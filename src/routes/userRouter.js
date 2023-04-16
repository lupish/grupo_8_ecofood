const express = require('express');
const router = express.Router();
const path = require('path');

//MIDDLEWARES
const guestMiddleware = require('../middlewares/guestMiddleware');
const authMiddleware= require('../middlewares/authMiddleware');
const adminPermission = require('../middlewares/adminPermission');

//MODULOS
const multerExport = require('../modulos/multer')
const validarRegistro = require('../modulos/validaciones/validacionesUsuario');


const { body } = require('express-validator');

//CONTROLADOR
const userController = require('../controllers/userController');

//RUTAS

//LOGIN
router.get('/login', userController.login);
router.post('/login', userController.processLogin);

//LOGOUT
router.get('/logout/:id', userController.logout);

//REGISTER
router.get('/register', guestMiddleware, userController.register);
router.post('/register', multerExport("user_foto", 'users', 'single'), validarRegistro("Registro"), userController.processCreate);

//DETaLLE DE USUARIO
router.get('/userDetail/:id', authMiddleware, userController.userDetail);

//EDICION DE ROL-USUARIO
router.get('/edit/:id', userController.edit);
router.put('/edit/:id', multerExport("user_foto", 'users', 'single'), validarRegistro("Editar"), userController.processEdit);


//ELIMINACION DE USUARIOS 
router.delete('/delete/soft/:id', adminPermission, userController.softDelete);

//REACTIVAR USURAIO
router.patch('/activar/:id', adminPermission, userController.processActivate);

module.exports = router;