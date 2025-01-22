const express = require("express")
const cors = require("cors")
const connectdb = require("./config/db")
const session = require("express-session")
const passport = require("passport")
const authRoutes = require("./routes/authRouter")
const authController = require("./controllers/authControllers")
const MongoStore = require('connect-mongo')


// Load enviorment variables
require("dotenv").config()

const app = express()

// Connect mongodb
connectdb();

// middleware
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000',  
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
}));

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
        ttl: 14 * 24 * 60 * 60,
    }),
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(authRoutes);

passport.serializeUser(authController.serializeUser)
passport.deserializeUser(authController.deserializeUser)


app.get("/login/success", async(req, res) => {
    if(req.user) {
        res.status(200).json({
            message: "User login successfully",
            user: req.user
        })
    } else {
        res.status(200).json({
            message: "Error: User Not login successfully"
        })
    }
})


app.get("/logout", async(req, res) => {
    req.logOut(function(error) {
        if(error) {
            return next(error)
        }
        res.redirect("http://localhost:3000/login")
    })
})


PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`server is running http://localhost:${PORT}`)
})