const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const mongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')

const errorController = require('./controllers/error')
const mongoConnect = require('./util/database').mongoConnect
const User = require('./models/user')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

const app = express()
const store = new mongoDBStore({
    uri: 'mongodb+srv://atulkkale:prdxn389@cluster0.h94h0.mongodb.net/shop?retryWrites=true&w=majority',
    collection: 'sessions'
})
const csrfProtection = csrf()

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }))
app.use(csrfProtection)
app.use(flash())

app.use((req, res, next) => {
    if (!req.session.user) {
        return next()
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = new User(user.name, user.email, user.password, user.cart, user.resetToken, user.resetTokenExpiration, user._id)
            next()
        })
        .catch(err => {
            console.log(err)
        })
})

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn
    res.locals.csrfToken = req.csrfToken()
    next()
})

app.use("/admin", adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

app.use(errorController.get404)

mongoConnect(() => {
    app.listen(3000)
})