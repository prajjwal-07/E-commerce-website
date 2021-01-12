const mongoose=require('mongoose')

const categorySchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    value:{
        type:String,
    }

})

const Category=new mongoose.model('Category',categorySchema);