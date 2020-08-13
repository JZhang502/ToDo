const express = require('express')
const router = express.Router()
const Project = require('../models/project')

router.get('/', async(req, res) =>{
    res.render('index', {projectss: res.locals.projectss})
})


module.exports = router