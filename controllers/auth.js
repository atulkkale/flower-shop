const bcrypt = require('bcryptjs')

const User = require("../models/user")

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Log in',
        path: '/login',
        isAuthenticated: false
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    User.findByEmail(email)
    .then(user => {
        if (!user) {
            return res.redirect('/login')
        }
        bcrypt.compare(password, user.password)
        .then(doMatch => {
            if (doMatch) {
                req.session.isLoggedIn = true
                req.session.user = user
                return req.session.save(err => {
                    console.log(err)
                    res.redirect('/')
                })
            }
            res.redirect('/login')
        })
        .catch(err => {
            console.log(err)
        })
    })
    .catch(err => {
        console.log(err)
    })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Sign up',
        path: '/signup',
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    User.findByEmail(email)
    .then(userDoc => {
        if(userDoc) {
            return res.redirect("/signup")
        }
        return bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User("Lorem", email, hashedPassword, { items: [] })
            return user.save()
        })
        .then(result => {
            res.redirect("/login")
        })
    })
    .catch(err => {
        console.log(err, "auth controller 38")
    })
}