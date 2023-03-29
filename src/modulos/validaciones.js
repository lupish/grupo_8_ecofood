const { body } = require('express-validator');
const validaciones = async (req, res, next)=>{
    const validar = [
        body("marca_nombre").notEmpty().withMessage("Debe ingresar un nombre"),
        body("marca_foto").custom((value, { req }) => {
            if (req.file) {
                const extensions = ['.jpg', '.png', '.gif', '.webp', '.jpeg']
                let fileExt = path.extname(req.file.originalname);
    
                if (!extensions.includes(fileExt)) {
                    throw new Error(`Las extensiones permitidas son : ${extensions.join(", ")}`)
                }
            }
            return true;
        })
    ];
    
}
module.exports = validaciones

//