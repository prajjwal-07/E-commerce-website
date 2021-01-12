const express=require('express');
const path=require('path');
const hbs=require('hbs');
const mongoose=require('mongoose');
const page=require('./routes/page');
const product=require('./routes/product');
const cart=require('./routes/cart');
const adminPage=require('./routes/admin_page');
const adminCategory=require('./routes/admin_category');
const adminProduct=require('./routes/admin_product');
const bodyParser = require('body-parser');
const session = require('express-session');
const fileUpload = require('express-fileupload');

//connect to DB
mongoose.connect("mongodb://localhost:27017/shoppingCart",{
  useNewUrlParser: true,
  useUnifiedTopology: true
//   useFindAndModify: false,
//   useCreateIndex: true,
}).then(() => console.log("connection done")).catch((err)=>console.log(err));

const app=express();

//static page
app.use(express.static(path.join(__dirname,"/public")));

app.set('view engine','hbs');

//partials
hbs.registerPartials(path.join(__dirname,"/partials"));


//body-parse middleware
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(bodyParser.json());

//session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { //secure: true,
        maxAge: 24 * 60 * 60 * 1000,
    }
}));

app.use(fileUpload());

app.get('*',(req,res,next)=>{
    res.locals.cart=req.session.cart;
    //console.log(res.locals);
    next();

})

app.use('/product',product);
app.use('/cart',cart);
app.use('/',page);
app.use('/admin/page',adminPage);
app.use('/admin/category',adminCategory);
app.use('/admin/product',adminProduct);



app.listen(3000,()=>{
    console.log("listening .....");
});