// Tablas de la base de datos
const db = require('../database/models');
const { productDetail } = require('./productController');
 // bd productos
 const Producto = db.Producto;

 // bd categorias
 const Categoria = db.Categoria;
 
 // bd estilosVida
 const EstiloVida = db.EstiloVida;
 
 // bd marcas
 const Marca = db.Marca;
 



const controller = {
    listAllProducts: async (req, res) => {
        let response = {}
        try {
            const prods = await Producto.findAll( {
                include:[
                    {association: 'ProductoImagen', attributes: ['id', 'img']}
                    ,{association: 'Marca', attributes: ['nombre']}
                    ,{association: 'EstiloVida', attributes: ['nombre']}
                    ,{association: 'Categoria', attributes: ['nombre']}
                ],
                attributes: ["id", "nombre", "precio", "descripcionCorta", "descripcionLarga"],
                paranoid: false
            })
            if(prods.length > 1){
                let detail = prods.map(elem =>{
                    let product = {
                        id: elem.id,
                        nombre: elem.nombre,
                        categoria: elem.Categoria.nombre,
                        marca: elem.Marca.nombre,
                        precio: elem.precio,
                        estiloVida: elem.EstiloVida.map(elem => elem.nombre),
                        descripcionCorta: elem.descripcionCorta,
                        descripcionLarga: elem.descripcionLarga,
                        detail: `/api/products/${elem.id}`, 
                        deleted_at: elem.deleted_at
                    }
                    return product
                })
                let categorias = await Categoria.findAll({include: [{association: 'Producto'}]})
                let categs = {}
                categorias.forEach(elem => {
                    categs[elem.nombre] =  elem.Producto.length
                })
                let estilosVida = await EstiloVida.findAll({include: [{association: 'Producto'}]})
                let estilos = {}
                estilosVida.forEach(elem => {
                    estilos[elem.nombre] =  elem.Producto.length
                })
                let marcas = await Marca.findAll({include: [{association: 'Producto'}]})
                let brands = {}
                marcas.forEach(elem => {
                    brands[elem.nombre] =  elem.Producto.length
                })

                response = {
                    status: 200,
                    quantity: prods.length, 
                    countByCategories: categs,
                    countByLifeStyles: estilos,
                    countByBrands: brands
                }
                response.data = detail;
        }
    
        } catch (error) {
            response = {
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

                response = {
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
                response = {
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
            response = {
                status: 500,
                description: error
            }

            console.log(error);
        }

        res.json(response);
    },
    detail: async (req, res) =>{
        let response = {};
        try{
            const productId = req.params.id;
            let productDB = await Producto.findByPk(productId, {
                include:[
                    {association: 'ProductoImagen', attributes: ['id', 'img']},
                    {association: 'Categoria', attributes: ['nombre']},
                    {association: 'Marca', attributes: ['nombre']},
                    {association: 'EstiloVida', attributes: ['nombre']}
                ],
                attributes: ['id', 'nombre', 'precio', 'descripcionCorta', 'descripcionLarga', 'created_at', 'updated_at', 'deleted_at'],
                paranoid: false
            })

            if (productDB) {
                response = {
                    status: 200,
                    ...productDB.dataValues
                }

                response.Categoria = undefined;
                response.categoria = productDB.Categoria.nombre;

                response.ProductoImagen = undefined;
                response.img = productDB.ProductoImagen.map(elem => elem.img);

                response.Marca = undefined;
                response.marca = productDB.Marca.nombre;

                response.EstiloVida = undefined;
                response.estiloVida = productDB.EstiloVida.map(elem => elem.nombre);

            } else {
                response = {
                status: 404,
                description: 'El producto buscado no existe'   
            }
        }
        } catch(error) {
            response = {
                status: 500,
                description: error
            }
            console.log(error);
        }

        res.json(response)
    }
}

module.exports = controller;