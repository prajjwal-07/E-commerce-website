const express=require("express")
const { check, validationResult } = require('express-validator');
require('../models/category');
const mongoose  = require("mongoose");
const router=express.Router();
const Category=mongoose.model('Category');

router.get('/',(req,res)=>{
    Category.find((err,docs)=>{
        if(!err){
            res.render('admin/category',{
                pagetitle:"categories",
                page:docs,

            })
        }
        else{
            res.status(400).send("error");
        }
        
    })
})
//add page
router.get('/add-category',(req,res)=>{
    res.render('admin/add_category',{
        pagetitle:"Add Category",
        
    })
})

router.post('/add-category',[
    check('title',"Title field is required").notEmpty(),
    check('value',"Value field is required").notEmpty()

],(req,res)=>{
    
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        
        res.render('admin/add_category',{
            pagetitle:"Add-category",
            errors:errors.errors,
            title:req.body.title,
            value:req.body.value,
            _id:req.body._id,
            
        })

    }
    else{
        if(req.body._id==='')
        {
            const newCategory=new Category({
                title:req.body.title,
                value:req.body.value,
                
     
             })
             newCategory.save((err,doc)=>{
                 if(!err)
                 {
                     res.redirect('/admin/category');
                 }
                 else{
                     console.log(err);
                 }
             })

        }
        else{
            
            Category.updateOne({_id:req.body._id},req.body,(err,doc)=>{
                if(!err)
                res.redirect('/admin/category');
                else{
                    console.log(err);
                }

            })
        }
        
        
        
    }
    
    
})

//update page
router.get('/update:id',(req,res)=>{

    Category.findById(req.params.id,(err,doc)=>{
        if(!err)
        {
            
            res.render('admin/add_category',{
                pagetitle:"Update Category",
                title:doc.title,
                value:doc.value,
                _id:doc._id,

            })
        }
        else{
            console.log(err);
        }
    })
})

//delete page
router.get('/delete:id',(req,res)=>{

    Category.deleteOne({_id:req.params.id},(err,doc)=>{
        if(!err)
        {
            res.redirect('/admin/category')
        }
        else{
            console.log(err);
        }
    })
})

module.exports=router;