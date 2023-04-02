const { body } = require('express-validator');
function validar (campoNombre, campoFoto) {
const validacion = [
    body(campoNombre).notEmpty().withMessage("Debe ingresar un nombre"),
    body(campoFoto).custom((value, { req }) => {
        const extensions = ['.jpg', '.png', '.gif', '.jpeg']
        const file = req.file;
        if(!file){
            throw new Error(`Las extensiones permitidas son : ${extensions.join(", ")}`)
        }

        return true;
    })
]
return validacion
}
module.exports = validar