// Mongoose model for our Users collection - includes password comparison used in authentication

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    displayname: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "acctUser" },
    friends: [{
        username: { type: String, required: true },
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    }],
    byMePendingTran: [{           // unpaid, paid by me
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        required: true,
    }],
    byMePastTran: [{              // history, paid by me
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        required: true,
    }],
    byOtPendingTran: [{           // unpaid, paid by other
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        required: true,
    }],
    byOtPastTran: [{               // history, paid by other
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        required: true,
    }]
})

// password comparison function
userSchema.methods.verifyPassword = function (password, callback) {
    bcrypt.compare(password, this.password, (err, valid) => {
        callback(err, valid)
    })
}

const SALT_FACTOR = 10

// hash password before saving
userSchema.pre('save', function save(next) {
    const user = this// go to next if password field has not been modified
    if (!user.isModified('password')) {
        return next()
    }

    // auto-generate salt/hash
    bcrypt.hash(user.password, SALT_FACTOR, (err, hash) => {
        if (err) {
            return next(err)
        }
        //replace password with hash
        user.password = hash
        next()
    })
})

const User = mongoose.model('User', userSchema)
module.exports = User