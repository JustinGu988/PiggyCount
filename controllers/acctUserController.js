const Users = require('../models/user.js')
const Transactions = require('../models/transaction.js')
const alert = require('alert');

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

// show friends page - requires authentication
const showFriendsPage = async (req, res) => {
    if (req.user.role === 'admin') {
        console.log("User is admin, cannot access friends page")
        res.redirect('/accessDenied')
    }
    else {
        let friList = []
        for (var i = 0; i < req.user.friends.length; i++) {
            const currFri = await Users.findById(req.user.friends[i].userID).lean()
            friList.push(currFri)
        }
        res.render('acctUserFriends.hbs', { acctUser: req.user.toJSON(), friends: friList })
    }
}

const postNewFriend = async (req, res, next) => {
    try {
        // capture input value
        const { userName } = req.body

        // find by userName
        var currFri = await Users.findOne({ username: userName })

        // if this user does not exist
        if (!currFri) {
            alert('User not found')
            return res.redirect('./friends')
        } else {
            // add this user into my friend list
            const newFri = {
                username: currFri.username,
                userID: currFri._id
            }
            req.user.friends.push(newFri)
            await req.user.save()

            // add me into his/her friend list
            const me = {
                username: req.user.username,
                userID: req.user._id
            }
            currFri.friends.push(me)
            await currFri.save()

            return res.redirect('./friends')
        }
    } catch (err) {
        return next(err)
    }
}


const showAccessDeniedPage = (req, res) => {
    res.render('accessDenied.hbs')
}

///////////////////////////////////////////
// END OF ACCTUSER CONTROL
///////////////////////////////////////////


module.exports = {
    postNewTransaction,
    showFriendsPage,
    postNewFriend,
    showAccessDeniedPage
}