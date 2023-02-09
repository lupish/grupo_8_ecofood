const path = require('path')
const fs = require('fs');
//bd roles
const rolesJSON = path.join(__dirname, '../data/rolesDB.json');
const roles = JSON.parse(fs.readFileSync(rolesJSON, 'utf-8'));

const authPage = (permissions)=>{
    return(req, res, next)=>{
    let useRole = req.body.rol.nombre
    if(permissions.includes(userRole)){
    next()
    }else{
return res.redirect('/products/product-not-found')
    }
}
}



module.exports = authPage;