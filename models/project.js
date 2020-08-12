const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    duedate1:{
        type:Date,
        required:true,
        default:Date.now,
        min: Date.now
    }
})

module.exports = mongoose.model('project', projectSchema)