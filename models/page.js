const mongoose=require('mongoose');

const PageSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String
    },
    
})

const Page=new mongoose.model("Page",PageSchema);