const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({  // each user has an array of these
    tranTime: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    description: { type: String },
    payerUsername: { type: String, required: true },
    payerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    paidFor: [{
        username: { type: String, required: true },
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        userAmount: { type: Number, required: true },
    }]
})

const Transaction = mongoose.model('Transaction', transactionSchema)
module.exports = Transaction