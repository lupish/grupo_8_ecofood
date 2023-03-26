// Tablas de la base de datos
const db = require('../database/models');
const Rol = db.Rol;

const adminPermission = async (req, res, next)=>{     
    if (req.session.usuarioLogueado) {
        const rolUser = await Rol.findByPk(req.session.usuarioLogueado.rol_id);
        if (rolUser && rolUser.nombre == "Administrador") {
            next()
        } else {
            return res.redirect('/products/product-not-found')
        }
    } else {
        return res.redirect('/products/product-not-found')
    }
}




module.exports = adminPermission;