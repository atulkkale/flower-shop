const Product = require('../models/product')
const User = require('../models/user')

exports.getAbout = (req, res, next) => {
    res.render('shop/about', {
        pageTitle: 'About', 
        path: '/about'
    })
}

exports.getShop = (req, res, next) => {
    Product.fetchAll()
    .then(products => {
        console.log(products)
        res.render('shop/shop', {
            pageTitle: 'Shop', 
            prods: products,
            path: '/newshop'
        })
    })
}

exports.getProductById = (req, res, next) => {
    const prodId = req.params.prodId
    Product.findById(prodId)
    .then(product => {
        res.render('shop/shop-details',{
            pageTitle: product.title,
            path: '/newshop',
            prod: product
        })
    })
}

exports.getCart = (req, res, next) => {
    req.user.getCart()
    .then(products => {
        res.render('shop/cart', {
            pageTitle: 'Cart', 
            path: '/Cart',
            products: products
        })
    })
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId
    Product.findById(prodId)
    .then(product => {
        return req.user.addToCart(product)
    })
    .then(result => {
        console.log(result,"c-shop,42")
        res.redirect("/cart")
    })
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId
    req.user
    .deleteItemFromCart(prodId)
    .then(result => {
        res.redirect("/cart")
    })
    .catch(err => {
        console.log(err)
    })
}

exports.postOrder = (req, res, next) => {
    req.user
    .addOrder()
    .then(result => {
        res.redirect("/orders")
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
    req.user.getOrders()
    .then(orders => {
        res.render('shop/orders', {
            pageTitle: 'Your orders', 
            path: '/orders',
            orders: orders
        })
    })
    .catch(err => console.log(err))
}

exports.getPortfolio = (req, res, next) => {
    res.render('shop/portfolio', {
        pageTitle: 'Portfolio', 
        path: '/portfolio'
    })
}

exports.getContact = (req, res, next) => {
    res.render('shop/contact', {
        pageTitle: 'Contact', 
        path: '/contact'
    })
}

exports.getBlog = (req, res, next) => {
    res.render('shop/blog', {
        pageTitle: 'Blogs', 
        path: '/blog'
    })
}

exports.getIndex = (req, res, next) => {
    res.render('shop/index', {
        pageTitle: 'The Green', 
        path: '/'
    })
}