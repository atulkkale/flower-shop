const mongodb = require('mongodb')
const getDb = require("../util/database").getDb

class User {
    constructor(username, email, password, cart, resetToken, resetTokenExpiration, id) {
        this.name = username
        this.email = email
        this.password = password
        this.cart = cart
        this.resetToken = resetToken
        this.resetTokenExpiration = resetTokenExpiration
        this._id = id
    }

    save() {
        const db = getDb()
        return db.collection("users").insertOne(this)
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString()
        })
        let newQuantity = 1
        let updatedCartItems = [...this.cart.items]

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1
            updatedCartItems[cartProductIndex].quantity = newQuantity
        } else {
            updatedCartItems.push({ 
                productId: new mongodb.ObjectId(product._id), 
                quantity: newQuantity 
            })
        }

        const updatedCart = { 
            items: updatedCartItems 
        }
        const db = getDb()
        return db
            .collection('users').updateOne(
                {_id: new mongodb.ObjectId(this._id)},
                {$set: {cart: updatedCart}}
            )
    }

    getCart(){
        const db = getDb()
        const productIds = this.cart.items.map(i => {
            return i.productId
        })
        return db
        .collection("products")
        .find({_id: { $in: productIds }})
        .toArray()
        .then(products => {
            return products.map(p => {
                return {
                    ...p, quantity: this.cart.items.find(i => {
                    return i.productId.toString() === p._id.toString()
                    }).quantity
                }
            })
        })
    }

    deleteItemFromCart(productId) {
        const updatedCart = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString()
        })
        const db = getDb()
        return db
            .collection('users').updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: { cart: {items: updatedCart} } }
            )
    }

    addOrder() {
        const db = getDb()
        return this.getCart()
        .then(products => {
            const order = {
                items: products,
                user: {
                    _id: new mongodb.ObjectId(this._id),
                    email: this.email
                }
            }
            return db.collection("orders").insertOne(order)
        })
        .then(result => {
            this.cart = { items: [] }
            return db
            .collection("users")
            .updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: { cart: { items: [] } } }
            )
        })
    }

    getOrders() {
        const db = getDb()
        return db
        .collection("orders")
        .find({ 'user._id': new mongodb.ObjectId(this._id) })
        .toArray()
    }

    updateUserById() {
        const db = getDb()
        return db.collection("users")
        .updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            { $set: this }
        )
    }

    static findById(userId) {
        const db = getDb()
        return db.collection("users")
        .findOne({_id: new mongodb.ObjectId(userId)})
    }

    static findByEmail(email) {
        const db = getDb()
        return db.collection("users")
        .findOne({ email: email })
    }

    static findByToken(token) {
        const db = getDb()
        return db.collection("users")
        .findOne({ resetToken: token })
    }

    static findByTokenAnduserId(token, userId) {
        const db = getDb()
        return db.collection("users")
        .findOne({ resetToken: token, _id: mongodb.ObjectId(userId) })
    }
}

module.exports = User