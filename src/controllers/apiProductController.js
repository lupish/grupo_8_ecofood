// Tablas de la base de datos
const db = require('../database/models');
const Producto = db.Producto;
const EstiloVida = db.EstiloVida;

const controller = {
    listAllProducts: async (req, res) => {
        let response = {}
        try {
            const prods = await Producto.findAll({
                include:[
                    {association: 'ProductoImagen', attributes: ['id', 'img']}
                    ,{association: 'Marca', attributes: ['nombre']}
                    ,{association: 'EstiloVida', attributes: ['nombre']}
                    ,{association: 'Categoria', attributes: ['nombre']}
                ],
                attributes: ["id", "nombre", "precio", "descripcionCorta", "descripcionLarga"],
                paranoid: false
            })

            response.info = {
                status: 200,
                quantity: prods.length
            }
            response.data = prods;
        } catch (error) {
            response.info = {
                status: 500,
                description: error
            }

            console.log(error);
        }

        res.json(response);
    },
    listProductsByLifeStyle: async (req, res) => {
        let response = {}
        try {
            const estiloVidaId = req.params.estiloVidaId;
            const estiloVida = await EstiloVida.findByPk(estiloVidaId);
            if (estiloVida) {
                const prods = await Producto.findAll({
                    include:[
                        {association: 'ProductoImagen', attributes: ['id', 'img']}
                        ,{association: 'Marca', attributes: ['nombre']}
                        ,{association: 'EstiloVida', attributes: ['nombre'], where: {id: estiloVidaId}}
                        ,{association: 'Categoria', attributes: ['nombre']}
                    ],
                    attributes: ["id", "nombre", "precio", "descripcionCorta", "descripcionLarga"],
                })

                response.info = {
                    status: 200,
                    quantity: prods.length,
                    filters: [
                        {
                            field: `Estilo de vida id = ${estiloVidaId}`,
                            value: estiloVida.nombre
                        }
                    ]
                }
                response.data = prods;
            } else {
                response.info = {
                    status: 404,
                    description: "No existe el estilo de vida seleccionado",
                    filters: [
                        {
                            field: `Estilo de vida id = ${estiloVidaId}`,
                            value: null
                        }
                    ]
                }
            }
            
            

            
        } catch (error) {
            response.info = {
                status: 500,
                description: error
            }

            console.log(error);
        }

        res.json(response);
    }
}

module.exports = controller;