const mongoose = require('mongoose')
const Item = require('./items')
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

projectSchema.pre('remove', function(next){
    mongoose.model('Items').find({project: this.id}, (err, items)=>{
        if(err){
            next(err)
        }
        else if(items.length > 0){
            next(new Error('This project still have toDos'))
            errorMessage = 'This project still have toDos'
        }else{
            next()
        }
    })
})
module.exports = mongoose.model('Project', projectSchema)