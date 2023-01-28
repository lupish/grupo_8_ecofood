const express = require('express');
const router = express.Router();

const about = require('../controllers/aboutUsController');

router.get('/', about.home);
router.post('/message', about.saveMessage);
router.post('/createDev', about.saveDev);


module.exports = router;