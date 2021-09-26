const express = require('express')

const path = require('path')

const adminController = require('../controllers/admin')

const router = express.Router()

router.get("/admin-home", adminController.getAdminHome)

router.get("/add-product", adminController.getAddProduct)

router.post("/add-product", adminController.postAddProduct)

router.get("/all-products", adminController.getAllProducts)

router.get("/edit-product/:productId", adminController.getEditProduct)

router.post("/edit-product", adminController.postEditProduct)

module.exports = router