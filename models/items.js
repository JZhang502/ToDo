const mongoose = require('mongoose')
//cosnt {model} = require('./project')

const itemsSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    duedate2:{
        type:Date,
        required:true,
        default:Date.now
    },
    priority:{
        type: String,
        required:true
    },
    project :{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'project'
    }
})

module.exports = mongoose.model('items', itemsSchema)