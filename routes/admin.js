const express = require('express')
const { body } = require('express-validator')

const path = require('path')

const adminController = require('../controllers/admin')
const isAuth  = require('../middleware/is-auth')
const isAdmin = require('../middleware/is-admin')

const router = express.Router()

router.get("/admin-home", isAdmin, isAuth, adminController.getAdminHome)

router.get("/add-product", isAdmin, isAuth, adminController.getAddProduct)

router.post("/add-product", [
    body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
    body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description')
        .isLength({ min: 5, max: 400 })
        .trim()
], isAdmin, isAuth, adminController.postAddProduct)

router.get("/all-products", isAdmin, isAuth, adminController.getAllProducts)

router.get("/edit-product/:productId", isAdmin, isAuth, adminController.getEditProduct)

router.post("/edit-product", [
    body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
    body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description')
        .isLength({ min: 5, max: 400 })
        .trim()
], 
isAdmin, isAuth, adminController.postEditProduct)

router.post("/delete-product", isAdmin, isAuth, adminController.postDeleteProduct)

module.exports = router