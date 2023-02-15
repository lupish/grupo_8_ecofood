const adminPermission = (req, res, next)=>{     
    if(req.session.usuarioLogueado){
    if(req.session.usuarioLogueado.rol == 2){
    next()
    }else{
return res.redirect('/products/product-not-found')
    }
}else{
    return res.redirect('/products/product-not-found')
}
}




module.exports = adminPermission;