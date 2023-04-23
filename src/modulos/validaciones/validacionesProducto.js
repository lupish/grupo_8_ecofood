const { check } = require('express-validator');
const db = require('../../database/models');
const Marca = db.Marca;
const Categoria = db.Categoria;
const EstiloVida = db.EstiloVida;

function validar (nombre, categoria, estilosVida, marca, precio, descCorta, descLarga, campoFoto) {
    const validacion = [
        check(nombre)
            .notEmpty()
            .isLength({min: 5})
            .withMessage("El nombre del producto no debe ser vacío y debe contener al menos 5 caracteres"),
        check(categoria).notEmpty().withMessage("La categoría del producto debe ser elegida"),
        check(estilosVida).notEmpty().withMessage("El estilo de vida del producto debe ser elegido"),
        check(marca).notEmpty().withMessage("La marca del producto debe ser elegida"),
        check(precio).notEmpty().withMessage("El precio no puede estar vacío").bail()
        .isNumeric().withMessage("El precio debe ser de tipo numérico").bail().custom((value,{req})=>(value=req.body.prod_precio<=0?false:true)).withMessage("El campo precio debe ser positivo y mayor a cero"),
        check(descCorta).notEmpty().withMessage("La descripción corta del producto no puede ser vacía"),
        check(descLarga).notEmpty().isLength({min: 20}).withMessage("La descripción larga del producto no puede ser vacía y debe contener al menos 20 caracteres"),
        check(campoFoto).custom((value, { req }) => {
            const extensions = ['.jpg', '.png', '.gif', '.jpeg']
            if(req.fileError == "ppp"){
                throw new Error(`Este campo es obligatorio y las extensiones permitidas son: ${extensions.join(", ")}`)
            }
            return true
        }),
        check(marca).custom(async (value, { req }) => {
            if (value) {
                try {
                    
                    let existeMarca = await Marca.findByPk(value);

                    if (!existeMarca) {
                        throw new Error(`La marca selecccionada no existe`)
                    }

                    return true
                } catch (error) {
                    throw new Error(`La marca selecccionada no existe`)    
                }
            }

            return true
        }),
        check(categoria).custom(async (value, { req }) => {
            if (value) {
                try {
                    let existeCategoria = await Categoria.findByPk(value);
                    if (!existeCategoria) {
                        throw new Error(`La categoría selecccionada no existe`)
                    }

                    return true
                } catch (error) {
                    throw new Error(`La categoría selecccionada no existe`)    
                }
            }

            return true
        }),
        check(estilosVida).custom(async (value, { req }) => {
            if (value) {
                try {
                    let existeEstiloVida = await EstiloVida.findAll({
                        where: {
                            id: value
                        }
                    });

                    if (value.length > 0 && value.length != existeEstiloVida.length) {
                        throw new Error(`Alguno de los estilos de vida seleccionados no existe`)
                    }

                    return true
                } catch (error) {
                    throw new Error(`Alguno de los estilos de vida seleccionados no existe`)    
                }
            }

            return true
        })
    ]

    return validacion
}

module.exports = validar

