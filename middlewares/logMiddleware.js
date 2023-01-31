const fs =require("fs")
const path=require("path")


console.log(path.join(__dirname,"/../src/data/logURL.txt"));

function log(req){
    
    let respuesta="*******************************\n"+
    "IP: "+req.ip+"\n"+
    "IPS: "+req.ips+"\n"+
    "URL: "+req.url+"\n"+
    "PROTOCOL: "+req.protocol+"\n"+
    "request.appcetsCharset: "+req.appcetsCharset+"\n"+
    "request.path: "+req.path+"\n"+
    "request.host: "+req.hostname+"\n"+
    "AJAx: "+req.xhr+"\n";
    "request.secure: "+req.secure+"\n"+
    "request.originalUrl: "+req.originalUrl+"\n"+
    "request.headers: "+req.headers+"\n";
    
    return "";
}
function logMiddleware(req,res,next){
  let registro=log(req)
fs.appendFileSync(path.join(__dirname,"../src/data/logURL.txt"),registro)

next();
}
module.exports=logMiddleware;