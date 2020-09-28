if(process.env.NODE_ENV !== 'production'){
    const dotenv = require('dotenv')
    dotenv.config({path:'.env'})
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const flash = require('express-flash')
const session = require('express-session')

const User = require('./models/user')
//const initializePassport = require('./passport-config')

const projectsRouter = require('./routes/projects')
const indexRouter = require('./routes/index')
const itemsRouter = require('./routes/items')
const loginRouter = require('./routes/login')
app.set('view engine', 'ejs')
app.set('views', __dirname+'/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended:false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }))
app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('connected to mongoose'))
const Project = require('./models/project')
app.use(async function (req, res, next){
        let projects
        try {
            projects = await Project.find().sort({duedate1: ''})
            .limit(6).exec()
        }catch(err){
            console.log(err)
            projects = []
        }
        res.locals.projectss = projects
        next()
    })

app.use('/', indexRouter)
app.use('/projects', projectsRouter)
app.use('/items', itemsRouter)
app.use('/login', loginRouter)

app.listen(process.env.PORT || 3000)