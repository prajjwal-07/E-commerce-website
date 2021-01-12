const express=require("express");
const  mongoose  = require("mongoose");

const router=express.Router()
require("../models/page")
require("../models/category")
const Page=mongoose.model('Page');
const Category=mongoose.model('Category');


router.get('/',(req,res)=>{
    
    Page.find((err,pages)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            Category.find((err,category)=>{
                if(!err)
                {
                   
                    res.render('main',{
                        pages:pages,
                        title:"User page",
                        category:category,
                    })

                }
            })
            
            
        }
    
    })
})

router.get('/:title',(req,res)=>{
    //console.log(req.params.title);
    Page.findOne({title:req.params.title},(err,page)=>{
        if(err)
        console.log(err);
        else{
            Page.find((err,pages)=>{
                if(err)
                {
                    console.log(err);
                }
                else{
                    res.render('index',{
                        pages:pages,//for header
                        title:page.title,
                        content:page.content,

                    })
                    
                }
            
            })
        }
    })
})


module.exports=router;