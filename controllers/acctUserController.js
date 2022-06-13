const Users = require('../models/user.js')
const Transactions = require('../models/transaction.js')

///////////////////////////////////////////
// ACCTUSER CONTROL
///////////////////////////////////////////
const postNewTransaction = async (req, res, next) => {
    try {
        // capture input value
        const { totalAmount, description, paidFor, userAmount } = req.body

        // list of debtors
        let currDebtor = await Users.findOne({ username: paidFor })
        debtors = [{ 
            username: currDebtor.username,
            userID: currDebtor._id, 
            userAmount: userAmount 
        }]

        const newTran = new Transactions({
            tranTime: new Date().toLocaleString('en-Au', {
                timeZone: 'Australia/Melbourne',
            }),
            totalAmount: totalAmount,
            description: description,
            payerUsername: req.user.username,   // my username
            payerID: req.user._id,              // my object id
            paidFor: debtors
        })

        // insert the new transaction to db
        await newTran.save()

        // insert this tran to debtors' "byOtPendingTran" list
        let currDebtor2 = await Users.findOne({ username: paidFor })
        currDebtor2.byOtPendingTran.push(newTran._id)
        await currDebtor2.save()

        // insert this tran to payer's "byMePendingTran" list
        let me = req.user
        me.byMePendingTran.push(newTran._id)
        await me.save()

        return res.redirect('./acctUser')
    } catch (err) {
        return next(err)
    }
}
///////////////////////////////////////////
// END OF ACCTUSER CONTROL
///////////////////////////////////////////


module.exports = {
    postNewTransaction,

}