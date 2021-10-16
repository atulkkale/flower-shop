const express = require('express')

const shopController = require('../controllers/shop')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

router.get("/about", shopController.getAbout)

router.get("/shop", shopController.getShop)

router.get("/shop/:prodId", shopController.getProductById)

router.get("/cart", isAuth, shopController.getCart)

router.post("/cart", isAuth, shopController.postCart)

router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct)

router.post("/create-order", isAuth, shopController.postOrder)

router.get("/orders", isAuth, shopController.getOrders)

router.get("/portfolio", shopController.getPortfolio)

router.get("/contact", shopController.getContact)

router.get("/blog", shopController.getBlog)

router.get("/", shopController.getIndex)

module.exports = router