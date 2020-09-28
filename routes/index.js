const express = require('express')
const router = express.Router()
const Project = require('../models/project')
const Item = require('../models/items')
const connectEnsureLogin = require('connect-ensure-login');

router.get('/',connectEnsureLogin.ensureLoggedIn(),
 async(req, res) =>{
    const items = await Item.find().sort({duedate2: ''}).limit(3).exec()
    res.render('index', {
        projectss: res.locals.projectss,
        items:items
    })
})


module.exports = router