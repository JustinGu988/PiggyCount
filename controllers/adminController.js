const Users = require('../models/user.js')
const Transactions = require('../models/transaction.js')
const passport = require('passport')
const bcrypt = require("bcrypt")


///////////////////////////////////////////
// ADMIN CONTROL
///////////////////////////////////////////

// add a new patient to the database
const postNewUser = async (req, res, next) => {
    try {
        // USER CREATION AND INSERTION:
        // capture input value
        const { userName, disName, role, pwd } = req.body

        const newUser = new Users({
            username: userName,
            displayname: disName,
            password: pwd,
            role: role
        })

        // insert the new user to db
        await newUser.save()
        return res.redirect('./acctUser')
    } catch (err) {
        return next(err)
    }
}



///////////////////////////////////////////
// END OF ADMIN CONTROL
///////////////////////////////////////////


///////////////////////////////////////////
// LOGIN AND AUTH
///////////////////////////////////////////

// Passport Authentication middleware
const isAuthenticated = (req, res, next) => {
    // If user is not authenticated via Passport, redirect to login page
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
    }
    // Otherwise, proceed to next middleware function
    return next()
}

// set up role-based authentication
const hasRole = (thisRole) => {
    return (req, res, next) => {
        if (req.user.role == thisRole)
            return next()
        else {
            res.redirect('/acctUser')
        }
    }
}

// show login page
const showLoginPage = (req, res) => {
    res.render('login', { flash: req.flash('error'), title: 'Login' })
}

// show About page - does not require authentication
const showAboutPage = (req, res) => {
    res.render('about.hbs', { loggedin: req.isAuthenticated() })   // tell Handlebars whether the user is logged in or not
}

// show acctUser page - requires authentication
const showAcctUserPage = async (req, res) => {
    if (req.user.role === 'admin') {
        res.redirect('/admin')    // redirect users with 'admin' role to admins' home page
    }
    else {
        let byMePendingTranArr = []
        let byMePendingTranID = req.user.byMePendingTran
        for (var i = 0; i < byMePendingTranID.length; i++) {
            const currTran = await Transactions.findById(byMePendingTranID[i]).lean()
            byMePendingTranArr.push(currTran)
        }

        let byOtPendingTranArr = []
        let byOtPendingTranID = req.user.byOtPendingTran
        for (var i = 0; i < byOtPendingTranID.length; i++) {
            const currTran = await Transactions.findById(byOtPendingTranID[i]).lean()
            byOtPendingTranArr.push(currTran)
        }

        res.render('acctUserMain.hbs', { acctUser: req.user.toJSON(), byMe: byMePendingTranArr, byOt: byOtPendingTranArr })    // users without 'admin' role (acctUser) go to this page
    }
}

// show Admin page - requires authentication AND user must have 'admin' role
const showAdminPage = async (req, res) => {
    // similar to "select * where role = …"
    const allAcctUsers = await Users.find({ role: 'acctUser' }, {}).lean() // get list of all students, to render for teacher
    res.render('adminMain.hbs', { data: { admin: req.user.toJSON(), acctUsers: allAcctUsers } })
}

// user logs out
const logoutAttempt = (req, res) => {
    req.logout()          // kill the session
    res.redirect('/acctUser')     // redirect user to acctUser page, which will bounce them to Login page
}

// show 404 page
const show404Page = (req, res) => {
    res.render('404.hbs')
}

///////////////////////////////////////////
// END OF LOGIN AND AUTH
///////////////////////////////////////////


module.exports = {
    postNewUser,


    isAuthenticated,
    hasRole,
    showLoginPage,
    showAboutPage,
    showAcctUserPage,
    showAdminPage,
    logoutAttempt,
    show404Page
}