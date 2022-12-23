let express=require('express');
const { dirname } = require('path');
const path=require('path')
// console.log(express)
let app=express();

app.use(express.static(path.resolve(__dirname,'./public')))
console.log(app)

app.listen(3000,()=>{console.log("Servidor Corriendo")})
app.get('/',(req,res)=>{
    let htmlPath=path.resolve(__dirname,'./views/home.html')
    res.sendFile(htmlPath)
})
app.get('/login',(req,res)=>{
    let htmlPath=path.resolve(__dirname,'./views/login.html')
    res.sendFile(htmlPath)
})
app.get('/register',(req,res)=>{
    let htmlPath=path.resolve(__dirname,'./views/register.html')
    res.sendFile(htmlPath)
})
app.get('/productDetail',(req,res)=>{
    let htmlPath=path.resolve(__dirname,'./views/productDetail.html')
    res.sendFile(htmlPath)
})


