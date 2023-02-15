
function guestMiddleware (req, res, next){
   if(req.session.usuarioLogueado) {
      console.log(req.session.usuarioLogueado.rol.id == 1);   
         let id = req.session.usuarioLogueado.id
         res.redirect('/users/userDetail/' + id)
         
   }
   next()

};
module.exports = guestMiddleware;
