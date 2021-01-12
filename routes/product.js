const express=require("express");
const mongoose = require("mongoose");
const router=express.Router()

require("../models/page")
require("../models/category")
require("../models/product")
const Page=mongoose.model('Page');
const Category=mongoose.model('Category');
const Product=mongoose.model('Product');

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
                   
                    Product.find((err,product)=>{
                        if(!err)
                        {
                            res.render('product',{
                                pages:pages,
                                title:"All product",
                                category:category,
                                product:product,
                            })
                        }
                    })

                }
            })
            
            
        }
    
    })
})

router.get('/:category',(req,res)=>{
    
    Page.find((err,pages)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            Category.find((err,categories)=>{
                if(!err)
                {
                   
                    Product.find({category:req.params.category},(err,product)=>{
                        if(!err)
                        {
                            res.render('product',{
                                pages:pages,
                                title:req.params.category,
                                category:categories,
                                product:product,
                            })
                        }
                    })

                }
            })
            
            
        }
    
    })
    
    
})




module.exports=router;