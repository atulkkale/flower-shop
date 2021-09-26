const path = require('path')

const express = require('express')

const shopController = require('../controllers/shop')

const router = express.Router()

router.get("/about", shopController.getAbout)

router.get("/shop", shopController.getShop)

router.get("/shop/:prodId", shopController.getProductById)

router.get("/portfolio", shopController.getPortfolio)

router.get("/contact", shopController.getContact)

router.get("/blog", shopController.getBlog)

router.get("/", shopController.getIndex)

module.exports = router