const express = require('express')
const router = express.Router()
const Project = require('../models/project')
const Item = require('../models/items')

//Show all projects
router.get('/', async (req, res)=>{
    let query = Project.find()
    if (req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i')) 
    }
    if(req.query.dueAfter != null && req.query.dueAfter != ''){
        query = query.gte('duedate1', req.query.dueAfter)
    }
    if(req.query.dueBefore != null && req.query.dueBefore != ''){
        query = query.lte('duedate1', req.query.dueBefore)
    }
    const projects = await query.exec()
    try{
        // const projects = await Project.find(searchOptions)
        res.render('projects/index',{
            projects:projects,
            searchOptions: req.query
        })
    }catch{
        res.redirect('/')
    }
})
//New project Route
router.get('/new', (req, res)=>{
    res.render('projects/new', {project: new Project})
})

//Create project route
router.post('/', async (req, res)=>{
    const project = new Project({
        title: req.body.title,
        duedate1: new Date(req.body.duedate1.replace(/-/g, '\/').replace(/T.+/, ''))
    })
    const title = req.body.title
    const now = new Date().toISOString()
    try{
        const newProject = await project.save()
        res.redirect(`/projects/${newProject.id}`)
    }catch{
        if(!isNaN(new Date(req.body.duedate1))){
            duedate1 = new Date(req.body.duedate1).toISOString()
        }else{
            duedate1 = new Date('05 October 2011 14:48 UTC').toISOString()
        }
        if((title == null || title == '')
            &&(duedate1 >= now)){
            res.render('projects/new', {
                project: project,
                errorMessage: 'Please enter a title'
            })
        }
        if(duedate1 < now
            && (title != null && title != '')){
            res.render('projects/new', {
                project: project,
                errorMessage: 'Please enter a valid date beyond today'
            })
        }
        if(duedate1 < now && (title == null || title == '')){
            res.render('projects/new', {
                project: project,
                errorMessage: 'Please check your date and title entered'
            })
        }
    }
})

//show projects
router.get('/:id', async (req, res)=>{
    let projects
    try{
        const project = await Project.findById(req.params.id)
        const items = await Item.find({project: project.id}).sort({duedate2: ''}).exec()
        res.render('projects/show',{
            project:project,
            prjToDo:items
        })
    }catch{
        redirect('/')
    }

})

router.get('/:id/edit', async (req, res)=>{
    try{
        const project = await Project.findById(req.params.id)
        res.render('projects/edit', {project:project})
    }catch{
        res.redirect('/projects')
    }
})
router.put('/:id', async (req, res)=>{
    let project
    try{
        project = await Project.findById(req.params.id)
        project.title = req.body.title
        project.duedate1 = new Date(req.body.duedate1.replace(/-/g, '\/').replace(/T.+/, ''))
        await project.save()
        res.redirect(`/projects/${project.id}`)
    }catch{
        if(project == null){
            res.redirect('/')
        }else{
            res.render('projects/new', {
                project : project,
                errorMessage: 'Error updating project'
            })
        }
    }
})
//delete projects
router.delete('/:id', async (req, res)=>{
    let project
    try{
        project = await Project.findById(req.params.id)
        //console.log(project)
        await project.remove()
        res.redirect('/projects')
    }catch(err){
        console.log(err)
        if(project == null){
            res.redirect('/')
        }else{
            console.debug()
            res.redirect(`/projects/${project.id}`)
        }
    }
})
module.exports = router