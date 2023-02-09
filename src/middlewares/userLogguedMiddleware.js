function userLoggedMiddleware (req, res, next){
    if(req.session && req.session.usuarioLogueado){
        res.locals.isLogged  = true;
        res.locals.usuarioLogueado = req.session.usuarioLogueado;
    }
next();
}
module.exports = userLoggedMiddleware;