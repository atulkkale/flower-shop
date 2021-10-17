const Product = require('../models/product')

exports.getAdminHome = (req, res, next) => {
    res.render('admin/admin-home', {
        pageTitle: 'Admin',
        path: '/admin'
    })
}

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add products',
        path: '/admin/edit-product',
        editing: false
    })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const price = req.body.price
    const imageUrl = req.body.imageUrl
    const description = req.body.description

    const product = new Product(title, price, description, imageUrl, null, req.user._id)

    product.save()
    .then(result => {
        console.log("Products created")
        res.redirect("/admin/all-products")
    }).catch(err => {
        console.log(err)
    })

}

exports.getAllProducts = (req, res, next) => {
    Product.fetchAll()
    .then(products => {
        res.render('admin/all-products', {
            pageTitle: 'All products', 
            prods: products,
            path: '/newshop'
        })
    })
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit
    if(!editMode){
        return res.redirect('/')
    }
    const prodId = req.params.productId
    Product.findById(prodId)
    .then(product => {
        res.render('admin/edit-product', {
            pageTitle: "Edit product",
            product: product,
            path: "/edit-product",
            editing: true
        })
    })
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId
    const updatedTitle = req.body.title
    const updatedPrice = req.body.price
    const updatedImage = req.body.imageUrl
    const updatedDescription = req.body.description

    console.log(prodId)

    const product = new Product(updatedTitle, updatedPrice, updatedDescription, updatedImage, prodId)
    product.save()
    .then(result => {
        console.log("Product updated!")
        res.redirect("/admin/all-products")
    })
    .catch(err => {
        console.log(err)
    })
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.prodId
    console.log(prodId)
    Product.deleteById(prodId)
    .then(result => {
        console.log(result, "deleted")
        res.redirect("/admin/all-products")
    })
    .catch(err => {
        console.log(err)
    })
}