const Product = require('../models/product')

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