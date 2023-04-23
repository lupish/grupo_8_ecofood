// Tablas de la base de datos
const db = require('../database/models');
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
        let prodsPage = 0

        // obtener campos de paginacion
        const size = parseInt(req.query.size) || 10;
        const page = parseInt(req.query.page) || 1;
        let offset = size * (page-1);
        const sortField = req.query.sortField || "id";
        const sortType = req.query.sortType || "ASC";
        const order = [sortField, sortType]
        
        if (!(sortField == "id" | sortField == "nombre" || sortField == "precio")) {
                return res.json({
                    status: 400,
                    description: "El campo sortField debe ser: id o nombre o precio",
                    paging: {
                        page: page,
                        size: size,
                        sortField: sortField,
                        sortType: sortType
                    }
                })
        }
        
        if (!(sortType == "ASC" || sortType == "DESC")) {
            return res.json({
                status: 400,
                description: "El campo sortType debe ser: ASC o DESC",
                paging: {
                    page: page,
                    size: size,
                    sortField: sortField,
                    sortType: sortType
                }
            })
        }

        try {
            
            
            // querar la tabla
            const prodsCount = await Producto.findAll({paranoid: false})
            const prods = await Producto.findAll( {
                include:[
                    {association: 'ProductoImagen', attributes: ['id', 'img']}
                    ,{association: 'Marca', attributes: ['nombre']}
                    ,{association: 'EstiloVida', attributes: ['nombre']}
                    ,{association: 'Categoria', attributes: ['nombre']}
                ],
                attributes: ["id", "nombre", "precio", "descripcionCorta", "descripcionLarga"],
                paranoid: false,
                limit: size,
                offset: offset,
                order: [order]
            })

            prodsPage = prods.length;

            if(prods.length > 0){
                let categorias = await Categoria.findAll({include: [{association: 'Producto'}]});
                let estilosVida = await EstiloVida.findAll({include: [{association: 'Producto'}]});
                let marcas = await Marca.findAll({include: [{association: 'Producto'}]});

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
                
                let categs = {}
                categorias.forEach(elem => {
                    categs[elem.nombre] =  elem.Producto.length
                })
                let estilos = {}
                estilosVida.forEach(elem => {
                    estilos[elem.nombre] =  elem.Producto.length
                })
                let brands = {}
                marcas.forEach(elem => {
                    brands[elem.nombre] =  elem.Producto.length
                })

                response = {
                    status: 200,
                    quantity: prodsCount.length, 
                    countByCategories: categs,
                    countByLifeStyles: estilos,
                    countByBrands: brands,
                    products: detail
                }
            } else {
                response = {
                    status: 404,
                    description: "No existen productos"
                }
            }

            // paginado
            response.paging = {
                page: page,
                size: size,
                count: prodsPage,
                order: order
            }

            if (prodsPage > 0 && page > 1) {
                response.paging.prev = `/api/products/?page=${page - 1}&size=${size}&sortField=${sortField}&sortType=${sortType}`
            }
            if (prodsPage > 0 && prodsCount.length > (offset+size)) {
                response.paging.next = `/api/products/?page=${page + 1}&size=${size}&sortField=${sortField}&sortType=${sortType}`
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