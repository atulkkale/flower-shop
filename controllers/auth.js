const crypto = require('crypto')

const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { validationResult } = require('express-validator/check')



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
        errorMessage: message,
        oldInput: {
            email: '',
            password: ''
        },
        validationErrors: []
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: errors.array()
        });
    }

    User.findByEmail(email)
    .then(user => {
        if (!user) {
            return res.status(422).render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: "Account with this email doesn't exist!",
                oldInput: {
                    email: email,
                    password: password
                },
                validationErrors: []
            });
        }
        bcrypt.compare(password, user.password)
        .then(doMatch => {
            if (doMatch) {
                if (user.email === "admin@admin.com") {
                    req.session.isAdmin = true
                }
                req.session.isLoggedIn = true
                req.session.user = user
                return req.session.save(err => {
                    console.log(err)
                    res.redirect('/')
                })
            }
            res.status(422).render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: "Incorrect password!",
                oldInput: {
                    email: email,
                    password: password
                },
                validationErrors: []
            });
        })
        .catch(err => {
            console.log(err)
        })
    })
    .catch(err => {
        console.log(err)
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
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
        errorMessage: message,
        oldInput: {
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationErrors: []
    })
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            pageTitle: 'Sign up',
            path: '/signup',
            errorMessage: errors.array()[0].msg,
            oldInput: { 
                email: email,
                password: password,
                confirmPassword: req.body.confirmPassword
            },
            validationErrors: errors.array()
        })
    }

        bcrypt.hash(password, 12)
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
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
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
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token
    User.findByToken(token)
    .then(user => {
        let message = req.flash("error")
        if (message.length > 0) {
            message = message[0]
        } else {
            message = null
        }
        res.render('auth/new-password', {
            pageTitle: 'New password',
            path: '/new-password',
            errorMessage: message,
            userId: user._id.toString(),
            passwordToken: token
        })
    })
    .catch(err => {
        console.log(err)
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
    })
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password
    const userId = req.body.userId
    const passwordToken = req.body.passwordToken
    let resetUser

    User.findByTokenAnduserId(passwordToken, userId)
    .then(user => {
        resetUser = new User("Lorem", user.email, user.password, user.cart, user.resetToken, user.resetTokenExpiration, user._id)
        return bcrypt.hash(newPassword, 12)
    })
    .then(hashedPassword => {
        resetUser.password = hashedPassword
        resetUser.resetToken = null
        resetUser.resetTokenExpiration = null
        return resetUser.updateUserById()
    })
    .then(result => {
        res.redirect("/login")
    })
    .catch(err => {
        console.log(err)
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
    })
}