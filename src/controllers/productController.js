//base de datos
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op, Association } = require("sequelize");


 // bd productos
const Producto = db.Producto;

// bd categorias
const Categoria = db.Categoria;

// bd estilosVida
const EstiloVida = db.EstiloVida;

// bd marcas
const Marca = db.Marca;

// bd imagenes 
const ProductoImagen = db.ProductoImagen

// validator
const {validationResult}=require("express-validator");

const controller = {
    productDetail: async (req, res) => {
        const t = await sequelize.transaction();
        let id = req.params.id
        try{
            if(req.session.usuarioLogueado && req.session.usuarioLogueado.rol_id ===  2){
                let producto = await Producto.findByPk(id, {include: [{association: 'ProductoImagen'}, {association: 'Marca'}, {association: 'EstiloVida'}], paranoid: false}, {transaction: t})
                await t.commit();
                return res.render('products/productDetail', {prod: producto, marca: Marca});
            }else if(!req.session.usuarioLogueado || req.session.usuarioLogueado.rol_id !=  2 ){
                let producto = await Producto.findByPk(id, {include: [{association: 'ProductoImagen'}, {association: 'Marca'}, {association: 'EstiloVida'}]}, {transaction: t})
                    if(producto){ 
                        await t.commit();
                        res.render('products/productDetail', {prod: producto, marca: Marca});
                    }else{
                        return res.redirect('/products/product-not-found')
                    }               
            }
        }
        catch (error){
            await t.rollback();
            console.log(error);
        }        
    },
    productCart: (req, res) => {
        res.render('products/productCart', {estilosVida: EstiloVida});
    },
    create: async (req, res) => {
        const t = await sequelize.transaction();
        try {
         let listaCateg = await Categoria.findAll({transaction: t});
         let listaEstilosVida = await EstiloVida.findAll({transaction: t});
         let listaMarcas = await Marca.findAll({transaction: t});
         await t.commit();
         res.render('products/create', {categorias: listaCateg, estilosVida: listaEstilosVida, marcas: listaMarcas});
        }
        catch (error){
            await t.rollback();
            console.log(error);
        }
    },
    processCreate: async (req, res) => { 
        const t = await sequelize.transaction();
        try{
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
                return res.redirect('/products/productDetail/' + newProduct.id)
            } else{
                let listaCateg = await Categoria.findAll();
                let listaEstilosVida = await EstiloVida.findAll();
                let listaMarcas = await Marca.findAll();
                res.render('products/create', {categorias: listaCateg, estilosVida: listaEstilosVida, marcas: listaMarcas, errores:errores.mapped(), prod:req.body});
            }
        }
        catch (error){
            await t.rollback();
            console.log(error);
        } 
    },
    listProducts: async (req, res) => {
        const t = await sequelize.transaction();
        try {
            let prods = await Producto.findAll({
                include:[
                    {association: 'ProductoImagen'}
                    ,{association: 'Marca'}
                    ,{association: 'EstiloVida'}
                ]
            },{transaction: t})
            let listaEstilosVida = await EstiloVida.findAll();
            
            if (req.params.idEstiloVida){
                let estilo = await EstiloVida.findByPk(req.params.idEstiloVida,{transaction: t})
                let prods = await Producto.findAll({
                    include:[
                            {association: 'ProductoImagen'}
                            ,{association: 'Marca'}
                            ,{association: 'EstiloVida', where: {id: req.params.idEstiloVida}}
                        ]
                },{transaction: t})
                await t.commit();
                res.render('products/listProducts', {prods: prods, estiloFiltrado: estilo, estilosVida: listaEstilosVida})
            } else {
                prods = await Producto.findAll({
                    include:[
                        {association: 'ProductoImagen'}
                        ,{association: 'Marca'}
                        ,{association: 'EstiloVida'}
                    ]
                },{transaction: t});
                await t.commit();
                res.render('products/listProducts', {prods: prods,  estilosVida: listaEstilosVida})
            }
        }
        catch (error){
            await t.rollback();
            console.log(error);
        } 
    },
    edit: async (req, res) => {
        const t = await sequelize.transaction();
        try{
            let listaCateg = await Categoria.findAll({transaction: t});
            let listaEstilosVida = await EstiloVida.findAll({transaction: t});
            let listaMarcas = await Marca.findAll({transaction: t});

            let prod =  await Producto.findByPk(req.params.id, {include:[{association: 'ProductoImagen'}, {association: 'Marca'},{association: 'Categoria'}, {association: 'EstiloVida'}],paranoid: false},{transaction: t})
            
            if (prod) {
            let prodEstilos = prod.EstiloVida.map(elem => elem.id)
            await t.commit();
                return res.render('products/edit', {categorias: listaCateg, estilosVida: listaEstilosVida, marcas: listaMarcas, prod: prod, estilos: prodEstilos});
            }else{
                return res.redirect('/products/product-not-found');
            }
        }
        catch (error){
            await t.rollback();
            console.log(error);
        } 
    },
    processEdit: async (req, res) => {
        const t = await sequelize.transaction();
        try{
            let idProd = req.params.id;    
            let errores = validationResult(req)
            
            if(errores.errors.length > 0){
                let listaCateg = await Categoria.findAll();
                let listaEstilosVida = await EstiloVida.findAll();
                let listaMarcas = await Marca.findAll();
                let prodEstilos;

                if (req.body.prod_estilosVida) {
                    prodEstilos = (req.body.prod_estilosVida).map(elem => parseInt(elem));
                } else {
                    prodEstilos = []
                }

                let prodViejo = await Producto.findByPk(idProd, {include:[{association: 'ProductoImagen'}], paranoid: false});

                let prodNuevo =
                {
                    id: idProd,
                    nombre: req.body.prod_nombre,
                    Categoria: {
                        id: req.body.prod_categoria
                    },
                    Marca: {
                        id: req.body.prod_marca
                    },
                    precio: req.body.prod_precio,
                    descripcionCorta: req.body.prod_descripcion_corta,
                    descripcionLarga: req.body.prod_descripcion_larga,
                    ProductoImagen: prodViejo.ProductoImagen
                }

                return res.render('products/edit',  {categorias: listaCateg, estilosVida: listaEstilosVida, marcas: listaMarcas, estilos: prodEstilos, errores:errores.mapped(), prod:prodNuevo})
            }
            await Producto.update(
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
            return res.redirect('/products/productDetail/' + idProd)
        }
        catch (error){
            await t.rollback();
            console.log(error);
        } 
    },
    softDelete: async (req,res)=>{
        const t = await sequelize.transaction();
        let id = req.params.id;
        try{
            let producto = await Producto.destroy({where:{id:id}})
            await t.commit();
            return res.redirect('/panels/manageProducts');
        }
        catch (error){
            await t.rollback();
            console.log(error);
        }     
    },
    hardDelete: async (req,res)=>{
        const t = await sequelize.transaction();
        let id = req.params.id;
        try{
            let producto = await Producto.destroy({where:{id:id}, force: true},{transaction: t})
            await t.commit();
            return res.redirect('/panels/manageProducts');
        }
        catch (error){
            await t.rollback();
            console.log(error);
        }      
    },
    processActivate: async (req, res) => {
        const t = await sequelize.transaction();
        let id = req.params.id;
        try {
            let producto = await Producto.restore({where:{id:id}},{transaction: t})
            await t.commit(); 
            return res.redirect('/panels/manageProducts/')
        }
        catch (error){
            await t.rollback();
            console.log(error);
        }    
    }    
}
module.exports = controller;


 // bd productos
//  const productsJSON = path.join(__dirname,'../data/productsDB.json');
//  const products = JSON.parse(fs.readFileSync(productsJSON, 'utf-8'));

// // bd categorias
// const categoriasJSON = path.join(__dirname,'../data/categoriasDB.json');
// const categorias = JSON.parse(fs.readFileSync(categoriasJSON, 'utf-8')).filter(elem => !elem.delete);

// // bd estilosVida
// const estilosVidaJSON = path.join(__dirname,'../data/estilosVidaDB.json');
// const estilosVida = JSON.parse(fs.readFileSync(estilosVidaJSON, 'utf-8')).filter(elem => !elem.delete);

// // bd marcas
// const marcasJSON = path.join(__dirname,'../data/marcasDB.json');
// const marcas = JSON.parse(fs.readFileSync(marcasJSON, 'utf-8')).filter(elem => !elem.delete);

// const controller = {
//     productDetail: (req, res) => {
 
//     //  let prod = products.find(elem => elem.id == req.params.id);
//     //      if (prod) {
           
//     //          if(req.session.usuarioLogueado && req.session.usuarioLogueado.rol == 1 && prod.delete == true){
//     //          return res.redirect('/products/product-not-found');
//     //      }
//     //      if(!req.session.usuarioLogueado && prod.delete == true){
//     //          return res.redirect('/products/product-not-found');
//     //      } 
//     //       res.render('products/productDetail', {prod: prod, estilosVida: estilosVida, marcas: marcas, estilosVida: estilosVida}); 
//     //      } else {
//     //          return res.redirect('/products/product-not-found');
//     //      }
        
//     },
// softDelete:(req,res)=>{
//     let id = req.params.id;
//     products.forEach(elem => {
//         if (elem.id == id) {
//             elem.delete=true;
//         }
//     });
//     fs.writeFileSync(productsJSON, JSON.stringify(products, null, 2));
//     return res.redirect('/products/productDetail/' + id)
// },
// hardDelete: async (req,res)=>{
//     let id = req.params.id;
//     let productsNotDelete=products.filter(row=>{return row.id!=id})

//     fs.writeFileSync(productsJSON, JSON.stringify(productsNotDelete, null, 2));

//     return res.redirect('/panels/manageProducts/')
// },
// processActivate: (req, res) => {
//     let id = req.params.id;
   
//     products.forEach(elem => {
//         if (elem.id == id) {
//             elem.delete = false;
//         }
//     });

//     fs.writeFileSync(productsJSON, JSON.stringify(products, null, 2));

//     return res.redirect('/panels/manageProducts/')
// },
// edit: (req, res) => {
//     let prod = products.find(elem => elem.id == req.params.id);
//     if (prod) {
//         res.render('products/edit', {categorias: categorias, estilosVida: estilosVida, marcas: marcas, prod: prod});
//     } else {
//         return res.redirect('/products/product-not-found');
//     }
// },
// processEdit: (req, res) => {
//     let id = req.params.id;
//     let prod = assignProd(id, req);
//     let  errores=validationResult(req)
//     if(errores.errors.length > 0){
//         return res.render('products/edit',  {categorias: categorias, estilosVida: estilosVida, marcas: marcas, errores:errores.mapped(), prod:prod})
//     }

//     products.forEach(elem => {
//         if (elem.id == id) {
//             elem.nombre = prod.nombre;
//             elem.categoria = prod.categoria;
//             elem.estilosVida = prod.estilosVida;
//             elem.marca = prod.marca;
//             elem.precio = prod.precio;
//             elem.descripcionCorta = prod.descripcionCorta;
//             elem.descripcionLarga = prod.descripcionLarga;
//             elem.imgs = elem.imgs.concat(prod.imgs);
//         }
//     })

//     fs.writeFileSync(productsJSON, JSON.stringify(products, null, 2))

//     return res.redirect('/products/productDetail/' + id)
// },
// listProducts: (req, res) => {
//     if (req.params.idEstiloVida) {
//         res.render('products/listProducts', {estilosVida: estilosVida, prods: products.filter(elem=>{return elem.delete==false && elem.estilosVida.some(estilo => estilo.id == req.params.idEstiloVida)}), marcas: marcas, estiloVidaFiltro: req.params.idEstiloVida})
//     } else {
//         res.render('products/listProducts', {estilosVida: estilosVida, prods: products.filter(elem=>{return elem.delete==false}), marcas: marcas})
//     }
// },
// edit: (req, res) => {
//     let prod = products.find(elem => elem.id == req.params.id);
//     if (prod) {
//         res.render('products/edit', {categorias: categorias, estilosVida: estilosVida, marcas: marcas, prod: prod});
//     } else {
//         return res.redirect('/products/product-not-found');
//     }
// },
// processEdit: (req, res) => {
//     let id = req.params.id;
//     let prod = assignProd(id, req);
//     let  errores=validationResult(req)
//     if(errores.errors.length > 0){
//         return res.render('products/edit',  {categorias: categorias, estilosVida: estilosVida, marcas: marcas, errores:errores.mapped(), prod:prod})
//     }

//     products.forEach(elem => {
//         if (elem.id == id) {
//             elem.nombre = prod.nombre;
//             elem.categoria = prod.categoria;
//             elem.estilosVida = prod.estilosVida;
//             elem.marca = prod.marca;
//             elem.precio = prod.precio;
//             elem.descripcionCorta = prod.descripcionCorta;
//             elem.descripcionLarga = prod.descripcionLarga;
//             elem.imgs = elem.imgs.concat(prod.imgs);
//         }
//     })

//     fs.writeFileSync(productsJSON, JSON.stringify(products, null, 2))

//     return res.redirect('/products/productDetail/' + id)
// },
// }










// function assignProd(prodId, req) {
//     // estilosVida del producto
//     let prodEstilosVida = [];
//     let categ = {};
//     if (req.body.prod_estilosVida) {
//         if (typeof(req.body.prod_estilosVida) == "string") {
//             categ = {id: req.body.prod_estilosVida};
//             prodEstilosVida.push(categ);
//         } else {
//             req.body.prod_estilosVida.forEach(elem => {
//                 categ = {id: elem};
//                 prodEstilosVida.push(categ);
//             });
//         }
//     }
    
//     // Imagenes del producto
//     let imgs = [];
//     let imgId = 1;
//     req.files.forEach(elem => {
//         img = {
//             id: imgId,
//             img: "/img/products/" + elem.filename,
//             alt: elem.originalname
//         };

//         imgs.push(img);
//         imgId ++;
//     })

//     // Crear producto
//     let prod = {
//         id: prodId,
//         nombre: req.body.prod_nombre,
//         categoria: req.body.prod_categoria,
//         estilosVida: prodEstilosVida,
//         marca: req.body.prod_marca,
//         precio: req.body.prod_precio,
//         descripcionCorta: req.body.prod_descripcion_corta,
//         descripcionLarga: req.body.prod_descripcion_larga,
//         imgs: imgs,
//         novedad: false,
//         preferido: false,
//         buscados: false,
//         delete: false
//     }

//     return prod;
// }