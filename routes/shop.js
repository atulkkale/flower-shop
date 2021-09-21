const path = require('path')

const express = require('express')

const productsController = require('../controllers/products')

const router = express.Router()

router.get("/about", productsController.getAbout)

router.get("/newshop", productsController.getNewShop)

router.get("/portfolio", productsController.getPortfolio)

router.get("/contact", productsController.getContact)

router.get("/blog", productsController.getBlog)

router.get("/", productsController.getIndex)

module.exports = router