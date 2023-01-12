const express = require("express");
const router = express.Router;

router.get("/newProduct", productController.newProduct)
router.post("/newProduct", productController.create)
module.exports = router;