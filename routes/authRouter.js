const express = require('express')
const router = express.Router()
const passport = require('passport')
const adminController = require('../controllers/adminController.js')
const acctUserController = require('../controllers/acctUserController.js')


///////////////////////////////////////////
// LOGIN AND AUTH ROUTES START HERE
///////////////////////////////////////////
// show login page
router.get('/login', adminController.showLoginPage)

// process login attempt
router.post('/login',
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),  // if bad login, send user back to login page
    (req, res) => {
        console.log('user ' + req.user.username + ' logged in with role ' + req.user.role)     // for debugging
        res.redirect('/acctUser')   // login was successful, send user to home page
    }
)

// user requests About page - does not require authentication
router.get('/about', adminController.showAboutPage)

// user requests AcctUser page - requires authentication
router.get('/acctUser', adminController.isAuthenticated, adminController.showAcctUserPage)

// user requests Admin page - requires authentication AND user must have 'admin' role
router.get('/admin', adminController.isAuthenticated, adminController.hasRole('admin'), adminController.showAdminPage)

// user logs out
router.post('/logout', adminController.logoutAttempt)

// if user attempts to access any other route, send a 404 error with a customized page
router.get('*', adminController.show404Page)
///////////////////////////////////////////
// END OF LOGIN AND AUTH ROUTES
///////////////////////////////////////////


module.exports = router