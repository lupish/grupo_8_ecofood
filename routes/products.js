const express = require("express");
const router = express.Router;

router.get("/newProduct", productController.newProduct)
router.post("/newProduct", productController.create)

router.get("/editProduct/:idProduct", productController.edit)
module.exports = router;