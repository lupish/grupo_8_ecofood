// Tablas de la base de datos
const db = require('../database/models');
const Producto = db.Producto;
const Categoria = db.Categoria;
const EstiloVida = db.EstiloVida;
const Marca = db.Marca;
const ProductoImagen = db.ProductoImagen
const Factura = db.Factura
const ProductoFactura = db.ProductoFactura
const { Op } = require("sequelize");

const sequelize = db.sequelize;
// validator
const {validationResult}=require("express-validator");

const controller = {
    listActiveProducts: async (req, res) => {
        let response = {}
        let prodsPage = 0

        // obtener campos de paginacion
        let size = parseInt(req.query.size) || 10;
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

            if (size == -1) {
                // sin paginado
                size = prodsCount.length
            }

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
                    let imagen = undefined;
                    if (elem.ProductoImagen && elem.ProductoImagen.length > 0) {
                        imagen = elem.ProductoImagen[0].img
                    }
                    
                    let product = {
                        id: elem.id,
                        nombre: elem.nombre,
                        categoria: elem.Categoria.nombre,
                        marca: elem.Marca.nombre,
                        precio: elem.precio,
                        estiloVida: elem.EstiloVida.map(elem => elem.nombre),
                        descripcionCorta: elem.descripcionCorta,
                        descripcionLarga: elem.descripcionLarga,
                        imagen: imagen,
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
                description: error.message
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
                description: error.message
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
                description: error.message
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
                description: error.message
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
                description: error.message
            }
        }
        res.json(response);
    },
    filterProducts: async (req, res) => {
        let response = {};

        let whereMarca = {}
        if (req.body.marca != "all") {
            whereMarca = {"id": req.body.marca}
        }

        let whereEstiloVida = {}
        if (req.body.estiloVida != "all") {
            whereEstiloVida = {"id": req.body.estiloVida}
        }

        let whereCategoria = {}
        if (req.body.categoria != "all") {
            whereCategoria = {"id": req.body.categoria}
        }

        let order = []
        if (req.body.campoOrden) {
            order[0] = req.body.campoOrden.toLowerCase()
            order[1] = req.body.orden
        }

        let whereFavoritos = {}
        if (req.body.listaFavoritos) {
            whereFavoritos = {
                id: {[Op.in]: req.body.listaFavoritos}
            }
        }

        let whereTexto = {}
        if (req.body.texto) {
            whereTexto = {
                [Op.or]: [
                    { nombre: { [Op.like]: `%${req.body.texto.toLowerCase()}%` } },
                    { descripcionCorta: { [Op.like]: `%${req.body.texto.toLowerCase()}%` } },
                    { descripcionLarga: { [Op.like]: `%${req.body.texto.toLowerCase()}%` } }
                ]
            }
        }

        let where = {
            [Op.and]: [
                whereFavoritos, whereTexto
            ]
        }
        
        try {

            let prods = await Producto.findAll( {
                include:[
                    {association: 'ProductoImagen', attributes: ['id', 'img']}
                    ,{association: 'Marca', attributes: ['nombre'], where: whereMarca}
                    ,{association: 'EstiloVida', attributes: ['nombre'], where: whereEstiloVida}
                    ,{association: 'Categoria', attributes: ['nombre'], where: whereCategoria}
                ],
                attributes: ["id", "nombre", "precio", "descripcionCorta", "descripcionLarga"],
                where : where,
                order: [order]
            })

            let prodFiltrados = prods.map( elem => {
                let imagen = undefined;
                if (elem.ProductoImagen && elem.ProductoImagen.length > 0) {
                    imagen = elem.ProductoImagen[0].img
                }
                let prod = {
                    id: elem.id,
                    nombre: elem.nombre,
                    precio: elem.precio,
                    marca: elem.Marca.nombre,
                    imagen: imagen
                }
                return prod
            })


            if (prodFiltrados) {
                response = {
                    status: 200,
                    count: prods.length,
                    data: prodFiltrados
                }
            }

        } catch (error) {
            console.log(error);

            response = {
                status: 500,
                description: error.message
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
                description: error.message
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
    },
    finalizarCompra: async (req, res) => {
        const carrito = req.body.carrito;
        const total = parseFloat(req.body.total.replace("$", ""))

        let response = {}
        if (!req.session.usuarioLogueado) {
            response = {
                status: 400,
                description: "El usuario debe estar logueado"
            }
            return res.json(response)
        }
        
        const t = await sequelize.transaction();
        try {
            const fecha = new Date();
            let compra = await Factura.create({
                usuario_id: req.session.usuarioLogueado.id,
                fecha_factura: fecha,
                total: total
            }, {transaction: t})

            for(let i = 0; i < carrito.length; i ++) {
                await ProductoFactura.create({
                    factura_id: compra.id,
                    producto_id: carrito[i].id,
                    cantidad: carrito[i].cantidad,
                    precio: carrito[i].precio
                }, {transaction: t})
            }

            response.status = 201;
            response.purchase = compra;
            await t.commit();

        } catch (error) {
            console.log(error)
            await t.rollback();
            response = {
                status: 500,
                description: error.message
            }
        }
        
        return res.json(response)
    },
    listadoVentas: async (req, res) => {
        response = {}

        try {
            const ventas = await Factura.findAll({
                include:[
                    {association: 'Producto'},
                    {association: 'Usuario', attributes: ['nombre', 'img']}
                ]
            })
            
            let detail = ventas.map(elem => {
                let prods = []
                elem.Producto.forEach(p => {
                    prods.push({
                        id: p.id,
                        nombre: p.nombre,
                        precio: p.ProductoFactura.precio,
                        cant: p.ProductoFactura.cantidad,
                        subtotal: (p.ProductoFactura.precio * p.ProductoFactura.cantidad),
                        detalle_prod: `/api/products/${p.id}`
                    })
                });

                return {
                    id: elem.id,
                    fecha_factura: elem.fecha_factura,
                    usuario: elem.Usuario.nombre,
                    usuario_avatar: elem.Usuario.img,
                    total: elem.total,
                    prods: prods
                }
            })

            let prods = await Producto.findAll({
                include:[
                    {association: 'Factura'}
                ]
            })

            let countByProducts = {}
            prods.forEach(elem => {
                let cantPorFactura = 0;
                let cant = 0
                let total = 0;

                elem.Factura.forEach(f => {
                    cantPorFactura += 1;
                    cant += f.ProductoFactura.cantidad;
                    total += (f.ProductoFactura.cantidad * f.ProductoFactura.precio)
                })

                countByProducts[elem.nombre] = {
                    cantPorFactura: cantPorFactura,
                    cantPorDetalle: cant,
                    total: total
                }
            })
        
            if (ventas.length > 0) {
                response = {
                    status: 200,
                    count: ventas.length,
                    data: detail,
                    countByProducts: countByProducts
                }
            } else {
                response = {
                    status: 404,
                    count: 0,
                    description: "No existen ventas"
                }
            }
        } catch (error) {
            response = {
                status: 500,
                description: error.message
            }

            console.log(error);
        }

        return res.json(response)
    }

}

module.exports = controller;