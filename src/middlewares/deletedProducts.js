const path = require('path')
const fs = require('fs');

const productsJSON = path.join(__dirname,'../data/productsDB.json');
const products = JSON.parse(fs.readFileSync(productsJSON, 'utf-8'));


const deletedProduct = (req, res, next)=>{
    if(req.session.usuarioLogueado){
        let userRole = req.session.usuarioLogueado.rol.nombre; 
        if(userRole == ){
            if(products.delete == true){
                let id = req.params.id;
                 return res.redirect('/products/productDetail/' + id)
            }
        }  
    }
    next()
}



module.exports = deletedProduct;