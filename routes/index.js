const express = require('express')
const router = express.Router()
const Project = require('../models/project')

router.get('/', async(req, res) =>{
    let projects
    try {
        projects = await Project.find().limit(6).exec()
    }catch{
        projects = []
    }
    res.render('index', {projects:projects})
})


module.exports = router