const express = require('express')

const path = require('path')

const adminController = require('../controllers/admin')
const isAuth  = require('../middleware/is-auth')
const isAdmin = require('../middleware/is-admin')

const router = express.Router()

router.get("/admin-home", isAdmin, isAuth, adminController.getAdminHome)

router.get("/add-product", isAdmin, isAuth, adminController.getAddProduct)

router.post("/add-product", isAdmin, isAuth, adminController.postAddProduct)

router.get("/all-products", isAdmin, isAuth, adminController.getAllProducts)

router.get("/edit-product/:productId", isAdmin, isAuth, adminController.getEditProduct)

router.post("/edit-product", isAdmin, isAuth, adminController.postEditProduct)

router.post("/delete-product", isAdmin, isAuth, adminController.postDeleteProduct)

module.exports = router