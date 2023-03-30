// Tablas de la base de datos
const db = require('../database/models');
const Rol = db.Rol;

const adminPermission = async (req, res, next)=>{     
    if (req.session.usuarioLogueado) {
        console.log(req.session.usuarioLogueado);
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