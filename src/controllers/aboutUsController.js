
let fs=require("fs");
const path = require('path');
const pathDeveloper=path.join(__dirname,'../data/developers.json');
let listOfDev=JSON.parse(fs.readFileSync(pathDeveloper,"utf-8"));

function createDeveloper(object){
  console.log(object);
  console.log(listOfDev.length);
  let idCreator;
  if(object.id){
    idCreator=object.id;
  }else{
   if(listOfDev.length==0){
    idCreator=1;
   }else{
    idCreator=listOfDev[(listOfDev.length-1)].id+1;
   }
  }
  let dev={
  id:idCreator,
  name:object.name,
  years:object.years,
  lastName:object.lastName,
  carrers:object.carrers,
  location:object.location,
  linkedin:object.linkedin,
  instagram:object.instagram,
  tiktok:object.tiktok,
  facebook:object.facebook,
  github:object.github,
  img:object.img,
  aboutMe:object.aboutMe,
  messages:[]
  }
return dev;
}

const controller={
    home:(req,res)=>{
        res.render("about/aboutus.ejs",{listOfDev:listOfDev})
    },
    saveDev:(req,res)=>{
      let object=req.body
      let dev=createDeveloper(object)      
      listOfDev.push(dev)      
      fs.writeFileSync(pathDeveloper,JSON.stringify(listOfDev, null, 2))
      return res.redirect('/aboutus')
    },
    saveMessage:(req,res)=>{
      if(req.body.message){
       listOfDev.filter(function(row){
      
if(row.id==req.body.id){
  row.messages.push(req.body.message)
}
       })
       fs.writeFileSync(pathDeveloper,JSON.stringify(listOfDev, null, 2))
      res.status(200).json({
        message: "ok"
      });
    }else{
       res.status(400).json({
        message: "no message"
      });
    }
  }
}
module.exports = controller;