const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add products',
        path: '/admin/add-product'
    })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const price = req.body.price
    const imageUrl = req.body.imageUrl
    const description = req.body.description

    const product = new Product(title, price, description, imageUrl)

    product.save()
    .then(result => {
        console.log("Products created")
        res.redirect("/")
    }).catch(err => {
        console.log(err)
    })

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
    Product.fetchAll()
    .then(products => {
        console.log(products)
        res.render('newshop', {
            pageTitle: 'Shop', 
            prods: products,
            path: '/newshop'
        })
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