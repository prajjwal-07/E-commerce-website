const express=require("express");
const  mongoose  = require("mongoose");
const router=express.Router()
require("../models/page")
require("../models/category")
require("../models/product")
const Page=mongoose.model('Page');
const Category=mongoose.model('Category');
const Product=mongoose.model('Product');

router.get('/add/:product',(req,res)=>{
    Product.findOne({title:req.params.product},(err,p)=>{
        if(err)
        console.log(err);
        else{
            
            if(typeof req.session.cart=="undefined")
            {
                req.session.cart=[];
                req.session.cart.push({
                    title:p.title,
                    qty:1,
                    price:p.price,
                    total:p.price,
                    image:`/product_img/${p._id}/${p.image}`,
                })
                req.session.total=p.price;
            }
            else{
                var cart=req.session.cart;
                req.session.total+=p.price;
                var flag=false;
                for(var i=0;i<cart.length;i++)
                {
                    
                    if(cart[i].title==p.title)
                    {
                        cart[i].qty++;
                        cart[i].total+=p.price;
                        flag=true;
                        break;
                        

                    }
                }
                if(!flag){
                    cart.push({
                        title:p.title,
                        qty:1,
                        price:p.price,
                        total:p.price,
                        image:`/product_img/${p._id}/${p.image}`,
                    })

                }
            }
            //res.locals.cart=req.session.cart;
            
            res.redirect('back');
        }
    })
    
})

router.get('/checkout',(req,res)=>{
    Page.find((err,doc)=>{
        if(!err)
        {
            Category.find((err,cat)=>{
                if(!err)
                {
                    if(typeof req.session.cart=="undefined")
                    {
                        res.render('checkout',{
                            title:"checkout",
                            emptytext:"Your cart is empty",
                            pages:doc,
                            category:cat,
                        })

                    }
                    else{
                        res.render('checkout',{
                            title:"checkout",
                            cart:req.session.cart,
                            sub_total:req.session.total,
                            pages:doc,
                            category:cat,

                        })

                    }
                }
            })
            

        }
    })
})

router.get('/update/:product',(req,res)=>{
    var action=req.query.action;
    var cart=req.session.cart;
    var sub_total=0;
    
    Product.findOne({title:req.params.product},(err,p)=>{
        if(!err)
        {
            
            for(var i=0;i<cart.length;i++)
            {
                if(cart[i].title==p.title)
                {
                    switch (action){
                        case "add":
                            
                            cart[i].qty+=1;
                            cart[i].total+=p.price;
                            
                            break;
                        case "remove":
                            cart[i].qty--;
                            cart[i].total-=p.price;
                            if(cart[i].qty<1)
                            {
                                cart.splice(i,1);
                                if(cart.length==0)
                                {
                                    delete req.session.cart;
                                }

                            }
                            break;
                        case "clear":
                            cart.splice(i,1);
                            if(cart.length==0)
                            {
                                delete req.session.cart;
                            }
                            break;
                        default:
                            console.log("No matching");
                            break;

                    }
                    
                }
            }
            for(var i=0;i<cart.length;i++)
            {
                sub_total+=cart[i].price*cart[i].qty;

            }
            req.session.total=sub_total;
            //console.log(cart);
            res.redirect('/cart/checkout');
        }
    })
    
    

})

router.get('/clear',(req,res)=>{
    delete req.session.cart;
    delete req.session.total;
    res.redirect('/cart/checkout');
})

module.exports=router;