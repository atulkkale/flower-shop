const crypto = require('crypto')

const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transport = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: ''
    }
}))

const User = require("../models/user")

exports.getLogin = (req, res, next) => {
    let message = req.flash("error")
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/login', {
        pageTitle: 'Log in',
        path: '/login',
        errorMessage: message
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    User.findByEmail(email)
    .then(user => {
        if (!user) {
            req.flash("error", "Invalid email!")
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
            req.flash("error", "Invalid password!")
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
    let message = req.flash("error")
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/signup', {
        pageTitle: 'Sign up',
        path: '/signup',
        errorMessage: message
    })
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    User.findByEmail(email)
    .then(userDoc => {
        if(userDoc) {
            req.flash("error", "This email address already exists!")
            return res.redirect("/signup")
        }
        return bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User("Lorem", email, hashedPassword, { items: [] }, null, null)
            return user.save()
        })
        .then(result => {
            res.redirect("/login")
            return transport.sendMail({
                to: email,
                from: 'atulk@axioned.com',
                subject: 'Signup succeeded!',
                html: '<h1>You successfully signed up!</h1>'
            })
        })
        .catch(err => {
            console.log(err)
        })
    })
    .catch(err => {
        console.log(err, "auth controller 38")
    })
}

exports.getReset = (req, res, next) => {
    let message = req.flash("error")
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/reset', {
        pageTitle: 'Reset Password',
        path: '/reset',
        errorMessage: message
    })
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
            return res.redirect("/")
        }
        const token = buffer.toString('hex')
        User.findByEmail(req.body.email)
        .then(user => {
            if (!user) {
                req.flash("error", "No account with that email found.")
                return res.redirect("/reset")
            }
            user.resetToken = token
            user.resetTokenExpiration = Date.now() + 3600000
            const userWithMethods = new User("Lorem", user.email, user.password, user.cart, token, user.resetTokenExpiration, user._id)
            return userWithMethods.updateUserById()
        })
        .then(result => {
            res.redirect('/')
            transport.sendMail({
                to: req.body.email,
                from: 'atulk@axioned.com',
                subject: 'Reset password',
                html: `
                    <p>You requested a password reset</p>
                    <p>Click this <a href='http://localhost:3000/reset/${token}'>link</a> to set a new password.</p>
                `
            })
        })
        .catch(err => {
            console.log(err)
        })
    })
}