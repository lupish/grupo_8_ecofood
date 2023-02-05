const express = require('express');
const router = express.Router();
const path = require('path');

//MULTER
const multer = require('multer');
const multerDiskStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, path.join(__dirname, "../../public/img/users"));
    },
    filename: (req, file, cb)=>{
        let fileExt = path.extname(file.originalname);
        let originalName = file.originalname.slice(0, file.originalname.length - fileExt.length);
        let imageName = 'user-' + originalName + '_' + Date.now() + path.extname(file.originalname);
        cb(null, imageName);
    }
});
const uploadFile = multer({storage: multerDiskStorage});



//CONTROLADOR
const userController = require('../controllers/userController');

//RUTAS

//LOGIN
router.get('/login', userController.login);
router.post('/login', userController.processLogin);
//REGISTER
router.get('/register', userController.register);
router.post('/register', uploadFile.single('user_foto'), userController.processCreate);

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