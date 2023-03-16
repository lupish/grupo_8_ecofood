const express = require('express');
const router = express.Router();
const path = require('path');

//MIDDLEWARES
const guestMiddleware = require('../middlewares/guestMiddleware');
const authMiddleware= require('../middlewares/authMiddleware');
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

const { body } = require('express-validator');
const validationRegister = [
    body("nombre").notEmpty().withMessage("Debe ingresar un nombre"),
    body("email").isEmail().withMessage("Debe ingresar un mail válido"),
    body("contrasenia").notEmpty().withMessage("Debe ingresar una contraseña"),
    body("confirmarContrasenia").notEmpty().withMessage("Debe confirmar la contraseña"),
    body("user_foto").custom((value, { req }) => {
        if (req.file) {
            const extensions = ['.jpg', '.png', '.gif', '.webp', '.jpeg']
            let fileExt = path.extname(req.file.originalname);

            if (!extensions.includes(fileExt)) {
                throw new Error(`Las extensiones permitidas son : ${extensions.join(", ")}`)
            }
        }

        return true;
    })
];

const validationEdit = [
    body("nombre").notEmpty().withMessage("Debe ingresar un nombre"),
    body("user_foto").custom((value, { req }) => {
        if (req.file) {
            const extensions = ['.jpg', '.png', '.gif', '.webp', '.jpeg']
            let fileExt = path.extname(req.file.originalname);

            if (!extensions.includes(fileExt)) {
                throw new Error(`Las extensiones permitidas son : ${extensions.join(", ")}`)
            }
        }

        return true;
    })
];

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
router.post('/register', uploadFile.single('user_foto'), validationRegister, userController.processCreate);

//DETaLLE DE USUARIO
router.get('/userDetail/:id', authMiddleware, userController.userDetail);

//EDICION DE ROL-USUARIO
router.get('/edit/:id', userController.edit);
router.put('/edit/:id', uploadFile.single('user_foto'), validationEdit, userController.processEdit);


//ELIMINACION DE USUARIOS 
router.delete('/delete/soft/:id', userController.softDelete);

//REACTIVAR USURAIO
router.patch('/activar/:id', userController.processActivate);

module.exports = router;