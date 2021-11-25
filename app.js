const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const mongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')
const multer = require('multer')

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

// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'images')
//     },
//     filename: (req, file, cb) => {
//         cb(null, Math.random() + '-' + file.originalname)
//     }
// })

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/png' ||
//         file.mimetype === 'image/jpg' ||
//         file.mimetype === 'image/jpeg') {
//         cb(null, true)
//     } else {
//         cb(null, false)
//     }
// }

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: false }))
// app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }))
app.use(csrfProtection)
app.use(flash())

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn
    res.locals.isAdmin = req.session.isAdmin
    res.locals.csrfToken = req.csrfToken()
    next()
})

app.use((req, res, next) => {
    if (!req.session.user) {
        return next()
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next()
            }
            req.user = new User(user.name, user.email, user.password, user.cart, user.resetToken, user.resetTokenExpiration, user._id)
            next()
        })
        .catch(err => {
            next(new Error(err))
        })
})

app.use("/admin", adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

app.get("/500", errorController.get500)

app.use(errorController.get404)

app.use((error, req, res, next) => {
    // res.redirect("/500")
    res.status(500).render('500', {
        pageTitle: "Error!",
        path: "Wrong path"
    })
})

mongoConnect(() => {
    app.listen(3000)
})