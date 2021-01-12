const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({
    
    title:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    image:{
        type:String,
        
    },

})

const Product=new mongoose.model('Product',productSchema);