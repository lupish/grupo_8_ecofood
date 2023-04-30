// Tablas de la base de datos
const db = require('../database/models');
const Producto = db.Producto;
const Categoria = db.Categoria;
const EstiloVida = db.EstiloVida;
const Marca = db.Marca;
const ProductoImagen = db.ProductoImagen

const sequelize = db.sequelize;
// validator
const {validationResult}=require("express-validator");

const controller = {
    listActiveProducts: async (req, res) => {
        let response = {}
        let prodsPage = 0

        // obtener campos de paginacion
        const size = parseInt(req.query.size) || 10;
        const page = parseInt(req.query.page) || 1;
        let offset = size * (page-1);
        const sortField = req.query.sortField || "id";
        const sortType = req.query.sortType || "ASC";
        const order = [sortField, sortType]
        
        if (!(sortField == "id" | sortField == "nombre" || sortField == "precio" || sortField == "created_at")) {
                return res.json({
                    status: 400,
                    description: "El campo sortField debe ser: id o nombre o precio o created_at",
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
            // querear la tabla
            const prodsCount = await Producto.findAll()
            const prods = await Producto.findAll( {
                include:[
                    {association: 'ProductoImagen', attributes: ['id', 'img']}
                    ,{association: 'Marca', attributes: ['nombre']}
                    ,{association: 'EstiloVida', attributes: ['nombre']}
                    ,{association: 'Categoria', attributes: ['nombre']}
                ],
                attributes: ["id", "nombre", "precio", "descripcionCorta", "descripcionLarga", "created_at", "deleted_at"],
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
                        imagen: elem.ProductoImagen[0].img,
                        detail: `/api/products/${elem.id}`, 
                        created_at: elem.created_at,
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
    listLyfeStyles: async (req, res) => {
        let response = {}
        try {
            let estilosVida = await EstiloVida.findAll();
            if (estilosVida.length > 0) {
                response = {
                    status: 200,
                    count: estilosVida.length,
                    data: estilosVida
                }
            } else {
                response = {
                    status: 404,
                    count: 0,
                    description: "No existen estilos de vida"
                }
            }
        } catch (error) {
            console.log(error);

            response = {
                status: 500,
                description: error
            }
        }
        res.json(response);
    },
    listBrands: async (req, res) => {
        let response = {}
        try {
            let brands = await Marca.findAll();
            if (brands.length > 0) {
                response = {
                    status: 200,
                    count: brands.length,
                    data: brands
                }
            } else {
                response = {
                    status: 404,
                    count: 0,
                    description: "No existen marcas"
                }
            }
        } catch (error) {
            console.log(error);

            response = {
                status: 500,
                description: error
            }
        }
        res.json(response);
    },
    listCategories: async (req, res) => {
        let response = {}
        try {
            let categorias = await Categoria.findAll();
            if (categorias.length > 0) {
                response = {
                    status: 200,
                    count: categorias.length,
                    data: categorias
                }
            } else {
                response = {
                    status: 404,
                    count: 0,
                    description: "No existen categorías"
                }
            }
        } catch (error) {
            console.log(error);

            response = {
                status: 500,
                description: error
            }
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
    },
    processCreate: async (req, res) => {
        let response = {}

        const t = await sequelize.transaction();
        try {
            let errores = validationResult(req);
            if(errores.errors.length === 0) {
                let newProduct = await Producto.create({
                    nombre: req.body.prod_nombre,
                    categoria_id: req.body.prod_categoria,
                    marca_id: req.body.prod_marca,
                    precio: req.body.prod_precio,
                    descripcionCorta: req.body.prod_descripcion_corta,
                    descripcionLarga: req.body.prod_descripcion_larga,
                }, {transaction: t})
         
                let idEstiloVida = req.body.prod_estilosVida
                for(let i = 0; i < idEstiloVida.length; i++){
                    await newProduct.addEstiloVida(idEstiloVida[i],{transaction: t})
                }
            
                let imagenes = req.files
                for(let i = 0; i < imagenes.length; i++){
                    await ProductoImagen.create({
                        img: "/img/products/" + imagenes[i].filename,
                        producto_id: newProduct.id
                    },{transaction: t})
                }
                await t.commit();

                // producto creado
                response.status = 201;
                response.product = newProduct;
            } else{
                response.status = 400;
                response.errors = errores.mapped();
            }
        }
        catch (error){
            await t.rollback();
            console.log(error);

            response.status = 500;
        }

        return res.json(response);
    },
    processEdit: async (req, res) => {
        let response = {}

        let idProd = req.params.id;
        let errores = validationResult(req);

        if (errores.errors.length > 0) {
            return res.json({
                status: 400,
                errors: errores.mapped()
            })
        }

        try {
            const t = await sequelize.transaction();
            let prodUpdate = await Producto.update(
                {
                    nombre: req.body.prod_nombre,
                    categoria_id: req.body.prod_categoria,
                    marca_id: req.body.prod_marca,
                    precio: req.body.prod_precio,
                    descripcionCorta: req.body.prod_descripcion_corta,
                    descripcionLarga: req.body.prod_descripcion_larga, 
                },
                {where: {id:idProd}, paranoid: false},
                {transaction: t}
            );
            if (prodUpdate == 0) {
                response.status = 404;
                response.description = "No existe el producto seleccionado";

                return res.json(response);
            }

            let prodNuevo = await Producto.findByPk(idProd, {transaction: t, paranoid: false});

            // reemplazar estilos de vida con los nuevos
            let prodEstilosVida = req.body.prod_estilosVida;
            await prodNuevo.setEstiloVida(prodEstilosVida)
            
            /*** Imagenes ***/
            let prodImagenes = req.files;
            // agregar nuevas fotos
            for(let i = 0; i < prodImagenes.length; i++){
                await ProductoImagen.create(
                    {
                        producto_id: idProd,
                        img: "/img/products/" + prodImagenes[i].filename
                    }, 
                    {transaction: t}
                )
            }
            
            await t.commit();

            response.status = 200;
            response.product = prodNuevo;
        } catch (error) {
            console.log(error);

            response.status = 500;
        }

        return res.json(response)
    


    },
    processDelete: async (req, res) => {
        let response = {}

        let id = req.params.id;

        try {
            let existeProd = await Producto.findByPk(id, {paranoid: false});
            if (existeProd) {
                const t = await sequelize.transaction();
                try {
                    let cantProdsActivados = await Producto.destroy({where:{id:id}, transaction: t})
                    await t.commit();

                    if (cantProdsActivados == 0) {
                        response.status = 400;
                        response.description = "El producto seleccionado ya está eliminado"
                    } else {
                        response.status = 200;
                    }
                } catch (error) {
                    await t.rollback();
                    console.log(error);

                    response.status = 500;
                }
            } else {
                response.status = 404;
                response.description = "No existe el producto seleccionado";
            }
        }
        catch (error) {
            console.log(error);

            response.status = 500;
        }

        return res.json(response)
    },
    processActivate: async (req, res) => {
        let response = {}
        let id = req.params.id;

        try {
            let existeProd = await Producto.findByPk(id, {paranoid: false});
            if (existeProd) {
                const t = await sequelize.transaction();
                try {
                    let cantProdsActivados = await Producto.restore({where:{id:id}, transaction: t})
                    await t.commit();

                    if (cantProdsActivados == 0) {
                        response.status = 400;
                        response.description = "El producto seleccionado ya está activo"
                    } else {
                        response.status = 200;
                    }
                } catch (error) {
                    await t.rollback();
                    console.log(error);

                    response.status = 500;
                }
            } else {
                response.status = 404;
                response.description = "No existe el producto seleccionado";
            }
        }
        catch (error) {
            console.log(error);

            response.status = 500;
        }

        return res.json(response)
    }
    /*,
    searchProducts: async (req, res) => {
        const busqueda = req.params.busqueda;
        const productosFiltrados = Producto.findAll({
            where: {
                $or: [
                    sequelize.where(
                        sequelize.fn('lower', sequelize.col('nombre')),
                        {
                          $like: 'abcd%'
                        }
                      )
                ]
            }
        })
    }*/

}

module.exports = controller;