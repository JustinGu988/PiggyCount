const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController.js')
const acctUserController = require('../controllers/acctUserController.js')

///////////////////////////////////////////
// ACCTUSER CONTROL ROUTES START HERE
///////////////////////////////////////////

router.post('/acctUser', acctUserController.postNewTransaction)

///////////////////////////////////////////
// END OF ACCTUSER CONTROL ROUTES
///////////////////////////////////////////

module.exports = router