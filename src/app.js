let express=require('express');
const path=require('path')
let app=express();

app.use(express.static('public'));
console.log(app)

// set views
app.set('views', path.join(__dirname, './views'));

// set engine
app.set('view engine', 'ejs');

app.listen(3000,()=>{console.log("Servidor Corriendo")})

app.get('/',(req,res)=>{
    res.render('home');
})
app.get('/login',(req,res)=>{
    res.render('login');
})
app.get('/register',(req,res)=>{
    res.render('register')
})
app.get('/productDetail',(req,res)=>{
    res.render('productDetail')
})
app.get('/productCart',(req,res)=>{
    res.render('productCart')
})

