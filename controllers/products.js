const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add products',
        path: '/admin/add-product'
    })
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title)
    product.save()
    res.redirect("/")
}

exports.getIndex = (req, res, next) => {
    res.render('index', {
        pageTitle: 'The Green', 
        path: '/'
    })
}

exports.getAbout = (req, res, next) => {
    res.render('about', {
        pageTitle: 'About', 
        path: '/about'
    })
}

exports.getNewShop = (req, res, next) => {
    res.render('newshop', {
        pageTitle: 'Shop', 
        path: '/newshop'
    })
}

exports.getPortfolio = (req, res, next) => {
    res.render('portfolio', {
        pageTitle: 'Portfolio', 
        path: '/portfolio'
    })
}

exports.getContact = (req, res, next) => {
    res.render('contact', {
        pageTitle: 'Contact', 
        path: '/contact'
    })
}

exports.getBlog = (req, res, next) => {
    res.render('blog', {
        pageTitle: 'Blogs', 
        path: '/blog'
    })
}