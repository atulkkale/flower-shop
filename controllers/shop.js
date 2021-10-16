const Product = require('../models/product')
const User = require('../models/user')

exports.getAbout = (req, res, next) => {
    res.render('shop/about', {
        pageTitle: 'About', 
        path: '/about',
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.getShop = (req, res, next) => {
    Product.fetchAll()
    .then(products => {
        console.log(products)
        res.render('shop/shop', {
            pageTitle: 'Shop', 
            prods: products,
            path: '/newshop',
            isAuthenticated: req.session.isLoggedIn
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
            prod: product,
            isAuthenticated: req.session.isLoggedIn
        })
    })
}

exports.getCart = (req, res, next) => {
    req.user.getCart()
    .then(products => {
        res.render('shop/cart', {
            pageTitle: 'Cart', 
            path: '/Cart',
            products: products,
            isAuthenticated: req.session.isLoggedIn
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
            orders: orders,
            isAuthenticated: req.session.isLoggedIn
        })
    })
    .catch(err => console.log(err))
}

exports.getPortfolio = (req, res, next) => {
    res.render('shop/portfolio', {
        pageTitle: 'Portfolio', 
        path: '/portfolio',
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.getContact = (req, res, next) => {
    res.render('shop/contact', {
        pageTitle: 'Contact', 
        path: '/contact',
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.getBlog = (req, res, next) => {
    res.render('shop/blog', {
        pageTitle: 'Blogs', 
        path: '/blog',
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.getIndex = (req, res, next) => {
    res.render('shop/index', {
        pageTitle: 'The Green', 
        path: '/',
        isAuthenticated: req.session.isLoggedIn
    })
}