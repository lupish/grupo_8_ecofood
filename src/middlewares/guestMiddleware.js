const path = require('path')
const fs = require('fs');

const usersJSON = path.join(__dirname,'../data/usersDB.json');
let users = JSON.parse(fs.readFileSync(usersJSON, 'utf-8'));

function guestMiddleware (req, res, next){
   
   if(req.session.usuarioLogueado) {
    let id = req.session.usuarioLogueado.id
    res.redirect('/users/userDetail/' + id)
   }
   next()

};
module.exports = guestMiddleware
