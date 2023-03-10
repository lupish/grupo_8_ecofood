
function guestMiddleware (req, res, next) {
   if(req.session.usuarioLogueado) {
      let id = req.session.usuarioLogueado.id
      res.redirect('/users/userDetail/' + id)
   }
   next()

};
module.exports = guestMiddleware;
