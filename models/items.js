const mongoose = require('mongoose')
const {model} = require('./project')

const itemsSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    duedate2:{
        type:Date,
        required:true,
        default:Date.now,
        min: Date.now
    },
    priority:{
        type: String,
        required:true
    },
    project:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Project'
    },
    description:{
        type: String
    }
})

module.exports = mongoose.model('Items', itemsSchema)