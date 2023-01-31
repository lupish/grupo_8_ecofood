const express = require('express');
const router = express.Router();
const path=require("path")
const about = require('../controllers/aboutUsController');
// multer subirda de archivos
const multer=require("multer")



// Express Validator
const {body}=require("express-validator")
const validations=[
  body('name1').notEmpty().withMessage("el nombre esta vacio")
]

const storage = multer.diskStorage({
    destination: path.join(__dirname,'../../public/img/developers/'),
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix+path.extname(file.originalname))
    }
  })
  
  const upload = multer({ storage: storage })

router.get('/', about.home);
router.post('/message',about.saveMessage);
router.post('/createDev',upload.single('img'),validations, about.saveDev);


module.exports = router;