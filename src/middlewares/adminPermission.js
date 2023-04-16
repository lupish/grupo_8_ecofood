const adminPermission = async (req, res, next)=>{     
    if (req.session.usuarioLogueado) {
         const rolUser = req.session.usuarioLogueado.rol.nombre
        if (rolUser == "Administrador") {
            next()
        } else {
            return res.redirect('/products/product-not-found')
        }
    } else {
        return res.redirect('/products/product-not-found')
    }
}
module.exports = adminPermission;