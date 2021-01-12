const express=require("express")
const { check, validationResult } = require('express-validator');
require('../models/product');
const mongoose=require("mongoose");
const router=express.Router();
const Product=mongoose.model('Product');
const Category=mongoose.model('Category');
const fs=require('fs-extra'); 
const resizeImg=require('resize-img');

router.get('/',(req,res)=>{
    Product.find((err,doc)=>{
        if(!err)
        {
            res.render('admin/product',{
                product:doc,
            });
        }
        else{
            res.status(400).send("error");
        }
    })
})

router.get('/add-product',(req,res)=>{
    Category.find((err,doc)=>{
        res.render('admin/add-product',{
            pagetitle:"Add product",
            category:doc,
            
        })

    })
    
})

router.post('/add-product',[
    check('title',"Title field is required").notEmpty(),
    check('description',"Content field is required").notEmpty(),
    check('price',"Price field is required").notEmpty(),
    check('price',"Price field must in decimal").isDecimal(),
    check('category',"Category field is required").notEmpty()
],(req,res)=>{
    
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        Category.find((err,doc)=>{
        res.render('admin/add-product',{
            pagetitle:"Add-product",
            errors:errors.errors,
            title:req.body.title,
            price:req.body.price,
            description:req.body.description,
            _id:req.body._id,
            category:doc,
            
            
        })
        })

    }
    else{
        if(req.body._id=="")
        {
            var price1=parseInt(req.body.price);
            
            var imageName= req.files!=null ? req.files.image.name: "";
            const newProduct=new Product({
                title:req.body.title,
                description:req.body.description,
                category:req.body.category,
                price:price1,
                image:imageName,

            })
            newProduct.save((err,doc)=>{
                if(!err)
                {
                    const dir=`public/product_img/${doc.id}`;
                    async function makedir (directory) {
                        try {
                          await fs.ensureDir(directory)
                          
                        } catch (err) {
                          console.error(err)
                        }
                      }
                    makedir(dir);
                    if(imageName!="")
                    {
                        productImage=req.files.image;
                        productImage.mv(`public/product_img/${doc._id}/${imageName}`,function(err){
                            if(err)
                            console.log(err);
                        })
                    }
                    res.redirect('/admin/product');

                }
                else{
                    console.log("error");
                }

            })


        }
        else{
            const detail=req.body;
            var imageName= req.files!=null ? req.files.image.name: "";
            if(imageName=="")
            {
                Product.findById({_id:req.body._id},(err,doc)=>{
                    if(!err)
                    detail.image=doc.image
                    else console.log(err);
                })
            }
            else{
                detail.image=imageName;
            }
            
            //console.log(detail);
            Product.updateOne({_id:req.body._id},detail,(err,doc)=>{
                if(!err)
                {
                    
                    if(imageName!="")
                    {
                        fs.emptyDir(`public/product_img/${req.body._id}`,function(err){
                            if(err)
                            console.log(err);
                            else{
                                productImage=req.files.image;
                                productImage.mv(`public/product_img/${req.body._id}/${imageName}`,function(errs){
                                if(err)
                                console.log(errs);
                                else{
                                    res.redirect('/admin/product');

                                }
                                })

                            }
                        })
                        


                    }
                    else{
                        res.redirect('/admin/product');

                    }
                    
                    
                }
                else{
                    console.log(err);
                }

            })
        }

    }

})

router.get('/update:id',(req,res)=>{

    Product.findById(req.params.id,(err,product)=>{
        if(!err)
        {
            Category.find((err,doc)=>{
                res.render('admin/add-product',{
                    pagetitle:"Update product",
                    title:product.title,
                    price:product.price,
                    description:product.description,
                    _id:product._id,
                    category:doc,
                    image:product.image,
                    
                })
                })
        }
        else{
            console.log(err);
        }
    })
})

router.get('/delete:id',(req,res)=>{
    fs.remove(`public/product_img/${req.params.id}`,function(err){
        if(err)
        console.log(err);
    })
   
    Product.deleteOne({_id:req.params.id},(errs,doc)=>{
        if(!errs)
        {
            
            res.redirect('/admin/product');
        }
        else{
            console.log(errs);
        }
    })

    
})


module.exports=router;