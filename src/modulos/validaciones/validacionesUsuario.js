const { body } = require('express-validator');
function validar(tipoValidacion) {
    // validaciones genericas de usuarui
    let validaciones = [
        body("nombre").notEmpty().withMessage("Debe ingresar un nombre"),
        body("user_foto").custom((value, { req }) => {
            const extensions = ['.jpg', '.png', '.gif', '.jpeg']
            const fileError = req.fileError;
            if(fileError){
                // multer dio error
                throw new Error(`Las extensiones permitidas son : ${extensions.join(", ")}`)
            }
    
            return true;
        })
    ]

    if (tipoValidacion == "Registro") {
        // validaciones para registro de usuario
        validaciones.push(body("contrasenia").notEmpty().withMessage("Debe ingresar una contraseña"))
        validaciones.push(body("email").isEmail().withMessage("Debe ingresar un mail válido"))
        validaciones.push(body("contrasenia").notEmpty().withMessage("Debe ingresar una contraseña"))
        validaciones.push(body("confirmarContrasenia").notEmpty().withMessage("Debe confirmar la contraseña"))
    }

    return validaciones
}
module.exports = validar