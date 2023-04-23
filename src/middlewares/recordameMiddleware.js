// Tablas de la base de datos
const db = require('../database/models');
const Usuario = db.Usuario;

const recordameMiddleware = async (req, res, next) => {
    if (req.cookies.email) {
        if (!req.session.usuarioLogueado) {
            let user = await Usuario.findOne({
                where: {
                    email: req.cookies.email
                },
                include: [{association: 'rol'}]
            });
          req.session.usuarioLogueado = user;
        }
    }
    
    next();
}

module.exports = recordameMiddleware;