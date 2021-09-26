const Product = require('../models/product')

exports.getAdminHome = (req, res, next) => {
    res.render('admin/admin-home', {
        pageTitle: 'Admin',
        path: '/admin'
    })
}

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
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