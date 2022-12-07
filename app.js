let express=require('express');
const { dirname } = require('path');
const path=require('path')
// console.log(express)
let app=express();

app.use(express.static(path.resolve(__dirname,'./public')))
console.log(app)

app.listen(3000,()=>{console.log("Servidor Corriendo")})
app.get('/',(req,res)=>{
    let htmlPath=path.resolve(__dirname,'./views/index.html')
    res.sendFile(htmlPath)
})
