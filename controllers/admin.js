const { validationResult } = require('express-validator')

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
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const price = req.body.price
    const imageUrl = req.body.imageUrl
    const description = req.body.description
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: "Add product",
            path: "/add-product",
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                imageUrl: imageUrl,
                description: description
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }

    const product = new Product(title, price, description, imageUrl, null, req.user._id)

    product.save()
    .then(result => {
        console.log("Products created")
        res.redirect("/admin/all-products")
    })
    .catch(err => {
        console.log(err)
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
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
    .catch(err => {
        console.log(err)
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
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
            editing: editMode,
            hasError: false,
            errorMessage: null,
            validationErrors: []
        })
    })
    .catch(err => {
        console.log(err)
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
    })
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId
    const updatedTitle = req.body.title
    const updatedPrice = req.body.price
    const updatedImage = req.body.imageUrl
    const updatedDescription = req.body.description

    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: "Edit product",
            path: "/edit-product",
            editing: true,
            hasError: true,
            product: {
                title: updatedTitle,
                price: updatedPrice,
                imageUrl: updatedImage,
                description: updatedDescription,
                _id: prodId
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }

    const product = new Product(updatedTitle, updatedPrice, updatedDescription, updatedImage, prodId)
    product.save()
    .then(result => {
        console.log("Product updated!")
        res.redirect("/admin/all-products")
    })
    .catch(err => {
        console.log(err)
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
    })
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.prodId
    console.log(prodId)
    Product.deleteById(prodId)
    .then(result => {
        res.redirect("/admin/all-products")
    })
    .catch(err => {
        console.log(err)
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
    })
}