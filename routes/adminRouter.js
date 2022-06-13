const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController.js')
const acctUserController = require('../controllers/acctUserController.js')

///////////////////////////////////////////
// ADMIN CONTROL ROUTES START HERE
///////////////////////////////////////////

router.post('/admin', adminController.postNewUser)

///////////////////////////////////////////
// END OF ADMIN CONTROL ROUTES
///////////////////////////////////////////

module.exports = router