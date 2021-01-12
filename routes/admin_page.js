const express=require("express")
const { check, validationResult } = require('express-validator');
const { mkdir } = require("fs-extra");
const mkdirp = require("mkdirp");
require('../models/page');
const mongoose  = require("mongoose");
const router=express.Router();
const Page=mongoose.model('Page');

router.get('/',(req,res)=>{
    Page.find((err,docs)=>{
        if(!err){
            res.render('admin/pages',{
                pagetitle:"pages",
                page:docs,

            })
        }
        else{
            res.status(400).send("error");
        }
        
    })
})
//add page
router.get('/add-page',(req,res)=>{
    res.render('admin/add_page',{
        pagetitle:"Add-page",
        
    })
})

router.post('/add-page',[
    check('title',"Title field is required").notEmpty(),
    check('content',"Content field is required").notEmpty()

],(req,res)=>{
    
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        
        res.render('admin/add_page',{
            pagetitle:"Add-page",
            errors:errors.errors,
            title:req.body.title,
            content:req.body.content,
            _id:req.body._id,
            
        })

    }
    else{
        if(req.body._id==='')
        {
            const newPage=new Page({
                title:req.body.title,
                content:req.body.content,
                
     
            })
            newPage.save((err,doc)=>{
                 if(!err)
                 {
                    res.redirect('/admin/page');
                 }
                 else{
                    console.log(err);
                 }
            })

        }
        else{
            
            Page.updateOne({_id:req.body._id},req.body,(err,doc)=>{
                if(!err)
                res.redirect('/admin/page');
                else{
                    console.log(err);
                }

            })
        }
        
        
        
    }
    
    
})

//update page
router.get('/update:id',(req,res)=>{

    Page.findById(req.params.id,(err,doc)=>{
        if(!err)
        {
            
            res.render('admin/add_page',{
                pagetitle:"Update page",
                title:doc.title,
                content:doc.content,
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

    Page.deleteOne({_id:req.params.id},(err,doc)=>{
        if(!err)
        {
            res.redirect('/admin/page')
        }
        else{
            console.log(err);
        }
    })
})

module.exports=router;