const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController.js')
const acctUserController = require('../controllers/acctUserController.js')

///////////////////////////////////////////
// ACCTUSER CONTROL ROUTES START HERE
///////////////////////////////////////////

router.post('/acctUser', acctUserController.postNewTransaction)
router.get('/acctUser/friends', adminController.isAuthenticated, acctUserController.showFriendsPage)
router.post('/acctUser/friends', acctUserController.postNewFriend)
router.get('/accessDenied', acctUserController.showAccessDeniedPage)

///////////////////////////////////////////
// END OF ACCTUSER CONTROL ROUTES
///////////////////////////////////////////

module.exports = router