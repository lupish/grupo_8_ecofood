// Tablas de la base de datos
const db = require('../database/models');
const Usuario = db.Usuario;

const recordameMiddleware = async (req, res, next) => {
    if (req.cookies.email) {
        if (!req.session.usuarioLogueado) {
            let usuarioMail = await Usuario.findAll({
                where: {
                    email: req.cookies.email
                }
            });
            if (usuarioMail.length > 0) {
                let user = usuarioMail[0]
                req.session.usuarioLogueado = user;
                console.log("Usuario recordado en session")
            }   
        }
    }
    
    next();
}

module.exports = recordameMiddleware;