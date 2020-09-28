const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../models/user')
//show login page
router.get('/', (req, res)=>{
    try {
        res.render('login/index')
    } catch (error) {
        res.redirect('/')
        console.log(error)
    }
})


router.post('/', passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), (req, res)=>{
    try {
        res.redirect('/')
    } catch (error) {
        console.log(err)
    }
})

  
//show registration page
router.get('/register', (req, res)=>{
    try {
        res.render('login/register')
    } catch (error) {
        res.redirect('/login')
        console.log(error)
    }
})
//post new user
router.post('/register', (req, res, next)=>{

    try {
        User.register(new User({
            username: req.body.username,
            email: req.body.email,
        }), req.body.password, (err)=>{
            if(err){
                console.log('error registering', err);
                return next(err)
            }
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
    //console.log(user)
})

router.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/login');
})

module.exports = router