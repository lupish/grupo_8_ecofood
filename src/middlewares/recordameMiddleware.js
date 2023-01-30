const path = require('path')
const fs = require('fs');

const usersJSON = path.join(__dirname,'../data/usersDB.json');
let users = JSON.parse(fs.readFileSync(usersJSON, 'utf-8'));

function recordameMiddleware(req, res, next) {
    if (req.cookies.email) {
        if (!req.session.usuarioLogueado) {
            let usuario = users.find(elem => elem.email == req.cookies.email);
            req.session.usuarioLogueado = usuario;
        }
    }
    
    

    next();
}

module.exports = recordameMiddleware;