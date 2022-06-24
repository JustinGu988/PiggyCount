// SET UP Express AND Handlebars
const express = require('express')
const app = express()
const flash = require('express-flash')  // for showing login error messages
const session = require('express-session')  // for managing user sessions
app.use(express.static('public'))   // define where static assets like CSS live
app.use(express.urlencoded({ extended: true })) // needed so that POST form works
app.use(flash())
const port = process.env.PORT || 3000

const exphbs = require('express-handlebars')
app.engine('hbs', exphbs.engine({   // configure Handlebars
    defaultlayout: 'main',
    extname: 'hbs'
}
))
app.set('view engine', 'hbs')

// set up login sessions - code is explained in tutorial

app.use(
    session({
        // The secret used to sign session cookies (ADD ENV VAR)
        secret: process.env.SESSION_SECRET || 'keyboard cat',
        name: 'demo', // The cookie name (CHANGE THIS)
        saveUninitialized: false,
        resave: false,
        proxy: process.env.NODE_ENV === 'production', //  to work on Heroku
        cookie: {
            sameSite: 'strict',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 300000 // sessions expire after 5 minutes
        },
    })
)

// get the Mongoose user model
const User = require('./models/user.js')

// connect to database
const mongoClient = require('./models/db.js')


// use PASSPORT
const passport = require('./passport.js')
app.use(passport.authenticate('session'))


// use EXPRESS-VALIDATOR (not actually used at this stage)
const { body, validationResult } = require('express-validator')
const { redirect } = require('express/lib/response')


// ROUTES START HERE
// Load authentication router
const adminRouter = require('./routes/adminRouter.js')
app.use(adminRouter)
const acctUserRouter = require('./routes/acctUserRouter.js')
app.use(acctUserRouter)
const authRouter = require('./routes/authRouter.js')
app.use(authRouter)
// END OF ROUTES


// listen for HTTP requests
app.listen(port, () => {
    console.log("> Server is up and running on http://localhost:" + port)
})
