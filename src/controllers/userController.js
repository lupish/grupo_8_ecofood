const path = require('path')
const fs = require('fs');

//controlador
const controller = {
    login: (req, res) => {
        if (req.session.usuarioLogueado) {
            return res.redirect('/')
        }

        res.render('users/login')
    },
    processLogin: (req, res) => {
        let errors = validationResult(req);
        if(errors.isEmpty()){
            for (let i = 0; i < users.length; i++){
                if (users[1].email == req.body,email){
                    if(bcrypt.compareSync(req.body.contrasenia, users[i].contrasenia)){
                        let usuarioALoguear = users[i];
                        break;
                    }
                }
            }
            if (usuarioALoguear == undefined){
                return req.render('login', {errors: [
                    {msg: 'Credenciales inválidas'}
                ]});
            };
            req.session.usuarioLogueado = usuarioALoguear;
            res.render('/')

        }else{
            return res.render('login', {errors:errors.errors})
        }
    },
    register: (req, res) => {
        if (req.session.usuarioLogueado) {
            return res.redirect('/')
        }

        res.render('users/register')
    },
    createAcount: (req, res) => {
       let usuario = {
           nombre: req.body.nombre,
           email: req.body.email,
           contrasenia: req.body.contrasenia,
           confirmarContrasenia: req.body.confirmarContrasenia
       }
    //GUARDAR
    const usersJSON = path.join(__dirname,'../data/usersDB.json');
    let archivoUsuario = fs.readFileSync(usersJSON, {encoding: 'utf-8'});
    let usuarios;
    if(archivoUsuario==""){
        usuarios = [];
    }else{
        usuarios = JSON.parse(archivoUsuario);
    }
    usuarios.push(usuario);
    usuariosJSON = JSON.stringify(usuarios);
    fs.writeFileSync(usersJSON, usuariosJSON);
   
    res.redirect('/');
 }
}


module.exports = controller;