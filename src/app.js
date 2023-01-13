const express=require('express');
const path=require('path')
const app=express();
const methodOverride = require("method-override")

app.use(express.static('public'));
console.log(app)

// set views
app.set('views', path.join(__dirname, './views'));

// set engine
app.set('view engine', 'ejs');

// POST
app.use(express.json());
app.use(express.urlencoded({ extended : false}));

//PUT
app.use(methodOverride("_method"));

app.listen(3000,()=>{console.log("Servidor Corriendo")})

app.get('/',(req,res)=>{
    res.render('home');
})
app.get('/login',(req,res)=>{
    res.render('users/login');
})
app.get('/register',(req,res)=>{
    res.render('users/register')
})
app.get('/productDetail',(req,res)=>{
    res.render('products/productDetail')
})
app.get('/productCart',(req,res)=>{
    res.render('products/productCart')
})
app.get('/newProduct',(req,res)=>{
    res.render('products/newProduct')
})
