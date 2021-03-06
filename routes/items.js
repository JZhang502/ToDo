const express = require('express')
const router = express.Router()
const Project = require('../models/project')
const Item = require('../models/items')
const connectEnsureLogin = require('connect-ensure-login');

//All items
router.get('/', connectEnsureLogin.ensureLoggedIn(), async (req, res)=>{
    let query = Item.find()
    if(req.query.name != null && req.query.name != ''){
        query = query.regex('name', new RegExp(req.query.name, 'i'))
    }
    if(req.query.priority != null && req.query.priority != ''){
        query = query.regex('priority', new RegExp(req.query.priority, 'i'))
    }
    if(req.query.dueAfter != null && req.query.dueAfter != ''){
        query = query.gte('duedate2', req.query.dueAfter)
    }
    if(req.query.dueBefore != null && req.query.dueBefore != ''){
        query = query.lte('duedate2', req.query.dueBefore)
    }
    const items = await query.exec()
    let projects = []
    for (var i = 0; i < items.length; i++){
        projects[i] = await Project.findById(items[i].project).exec()
    }
    try{
        res.render('items/index', {
            items:items,
            searchOptions : req.query,
            projects: projects
        })
    }catch{
        res.redirect('/')
    }
})
//New items
router.get('/new', connectEnsureLogin.ensureLoggedIn(), async (req, res)=>{
    renderNewPage(res, new Item())
})

router.get('/new/:id', connectEnsureLogin.ensureLoggedIn(), (req, res)=>{
    const id = req.params.id
    renderNewPage(res, new Item(), false, id)

})

//create item
router.post('/',connectEnsureLogin.ensureLoggedIn(), async(req, res)=>{
    const item = new Item({
        name: req.body.name,
        project: req.body.project,
        duedate2: new Date(req.body.duedate2),
        priority: req.body.priority,
        description: req.body.description
    })
    try{
        const newItem = await item.save()
        res.redirect('/items')
    }catch{
        renderNewPage(res, item, true)
    }
})
//item details
router.get('/:id',connectEnsureLogin.ensureLoggedIn(), async (req, res)=>{
    try{
        const item = await Item.findById(req.params.id).populate('project').exec()
        res.render('items/show', {item:item, project:item.project})
    }catch{
        res.redirect('/')
    }
})
//Edit item
router.get('/:id/edit', connectEnsureLogin.ensureLoggedIn(), async (req, res)=>{
    try{
        const item = await Item.findById(req.params.id)
        renderEditPage(res, item)
    }catch{
        redirect('/')
    }
})
//update item
router.put('/:id', connectEnsureLogin.ensureLoggedIn(), async (req, res)=>{
    let item
    try {
        item = await Item.findById(req.params.id)
        item.name = req.body.name
        item.project = req.body.project
        item.duedate2 = new Date(req.body.duedate2)
        item.priority = req.body.priority
        item.description = req.body.description
        await item.save()
        res.redirect(`/items/${item.id}`)
    } catch{
        renderEditPage(res, item, true)
    }
})

//delete item
router.delete('/:id', connectEnsureLogin.ensureLoggedIn(), async (req, res)=>{
    let item
    try {
        item = await Item.findById(req.params.id)
        await item.remove()
        res.redirect('/items')
    } catch {
        if(item == null){
            res.redirect('/')
        }else{
            console.debug()
            res.redirect(`/items/${item.id}`)
        }
    }
})
async function renderNewPage(res, item, hasError = false, id = null){
    renderFormPage(res, item, 'new', hasError, id)
}
async function renderEditPage(res, item, hasError = false, id = null){
    renderFormPage(res, item, 'edit', hasError, id)
}
async function renderFormPage(res, item, form, hasError, id){
    try{
        let projects
        if(id === null){
            projects = await Project.find({})
        }if(id != null){
            projects = []
            projects[0] = await Project.findById(id)
        }
        const params ={
            projects:projects,
            item:item
        }
        if(hasError){
            if(form == 'edit'){
                params.errorMessage = 'Error Editing item'
            }else{
                params.errorMessage = 'Error Creating item'
            }
        }
        res.render(`items/${form}`, params)
    }catch{
        res.redirect('/items')
    }
}
module.exports = router