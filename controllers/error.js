exports.get404 = (req, res, next) => {
    res.status(404).render('404', {
        pageTitle: "Page not found",
        path: "Wrong path",
        isAuthenticated: req.session.isLoggedIn
    })
}