const { body } = require('express-validator');
function validar(tipoValidacion) {
    // validaciones genericas de usuarui
    let validaciones = [
        body("nombre").isLength({min: 2}).withMessage("El nombre debe tener al menos 2 caracteres"),
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
        validaciones.push(body("contrasenia").isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        }).withMessage("La contraseña debe tener al menos 8 caracteres, letras mayúsculas y minúsculas, un número y un símbolo"))
        
        validaciones.push(body("email").isEmail().withMessage("Debe ingresar un mail válido"))
        validaciones.push(body("contrasenia").notEmpty().withMessage("Debe ingresar una contraseña"))
        validaciones.push(body("confirmarContrasenia").notEmpty().withMessage("Debe confirmar la contraseña"))
    }

    return validaciones
}
module.exports = validar