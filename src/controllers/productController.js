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

const ProductoEstiloVida = db.ProductoEstiloVida

// validator
const {validationResult}=require("express-validator");

const controller = {
    productDetail: async (req, res) => {
        let id = req.params.id
        try{
            if(req.session.usuarioLogueado && req.session.usuarioLogueado.rol ==  2){
                let producto = await Producto.findByPk(id, {include:[{association: 'ProductoImagen'}, {association: 'Marca'}, {association: 'EstiloVida'}]}, {paranoid: false})
                return res.render('products/productDetail', {prod: producto, estilosVida: EstiloVida});
            }else if(!req.session.usuarioLogueado || req.session.usuarioLogueado.rol !=  2 ){
                let producto = await Producto.findByPk(id, {include: [{association: 'ProductoImagen'}, {association: 'Marca'}, {association: 'EstiloVida'}]})
                    if(producto){
                        return res.render('products/productDetail', {prod: producto, estilosVida: EstiloVida, marcas: Marca});
                    }else{
                        return res.redirect('/products/product-not-found')
                    }               
            }
        }
        catch (error){
         console.log(error);
        }        
    },
    productCart: (req, res) => {
        res.render('products/productCart', {estilosVida: EstiloVida});
    },
    create: async (req, res) => {
        try {
         let listaCateg = await Categoria.findAll();
         let listaEstilosVida = await EstiloVida.findAll();
         let listaMarcas = await Marca.findAll();
         res.render('products/create', {categorias: listaCateg, estilosVida: listaEstilosVida, marcas: listaMarcas});
        }
        catch (error){
            console.log(error);
        }
    },
    processCreate: async (req, res) => { 
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
                })
         
                let idEstiloVida = req.body.prod_estilosVida
                for(let i = 0; i < idEstiloVida.length; i++){
                    await newProduct.addEstiloVida(idEstiloVida[i])
                }
            
                let imagenes = req.files
                for(let i = 0; i < imagenes.length; i++){
                    await ProductoImagen.create({
                        img: "/img/products/" + imagenes[i].filename,
                        producto_id: newProduct.id
                    })
                }
    
                return res.redirect('/products/productDetail/' + newProduct.id)
            } else{
                res.render('products/create', {categorias: Categoria, estilosVida: EstiloVida, marcas: Marca, errores:errores.mapped(), prod:req.body});
            }
        }
        catch (error){
            console.log(error);
        } 
    },
    listProducts: async (req, res) => {
        try {
            let prods = await Producto.findAll({
                include:[
                    {association: 'ProductoImagen'}
                    ,{association: 'Marca'}
                    ,{association: 'EstiloVida'}
                ]
            })
            let listaEstilosVida = await EstiloVida.findAll();
            
            if (req.params.idEstiloVida){
                let estilo = await EstiloVida.findByPk(req.params.idEstiloVida)
                let prods = await Producto.findAll({
                    include:[
                            {association: 'ProductoImagen'}
                            ,{association: 'Marca'}
                            ,{association: 'EstiloVida', where: {id: req.params.idEstiloVida}}
                        ]
                })

                res.render('products/listProducts', {prods: prods, estiloFiltrado: estilo, estilosVida: listaEstilosVida})
            } else {
                prods = await Producto.findAll({
                    include:[
                        {association: 'ProductoImagen'}
                        ,{association: 'Marca'}
                        ,{association: 'EstiloVida'}
                    ]
                });
                
                res.render('products/listProducts', {prods: prods,  estilosVida: listaEstilosVida})
            }
        }
        catch (error){
            console.log(error);
        } 
    },
    edit: async (req, res) => {
        try{
         let listaCateg = await Categoria.findAll();
         let listaEstilosVida = await EstiloVida.findAll();
         let listaMarcas = await Marca.findAll();
            let prod =  await Producto.findByPk(req.params.id, {include:[{association: 'ProductoImagen'}, {association: 'Marca'},{association: 'Categoria'}, {association: 'EstiloVida'}]})
            if (prod) {
               let prodEstilos = prod.EstiloVida.map(elem => elem.id)
                return res.render('products/edit', {categorias: listaCateg, estilosVida: listaEstilosVida, marcas: listaMarcas, prod: prod, estilos: prodEstilos});
            }else{
                return res.redirect('/products/product-not-found');
            }
        }
        catch (error){
            console.log(error);
        } 
    },
    processEdit: async (req, res) => {
        try{
            let idProd = req.params.id;
            
            let errores = validationResult(req)
            if(errores.errors.length > 0){
                return res.render('products/edit',  {categorias: Categoria, estilosVida: EstiloVida, marcas: Marca, errores:errores.mapped(), prod:prod})
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
                {where: {id:idProd}}
            );
            let prodNuevo = await Producto.findByPk(idProd);

            /*** Estilos de vida ***/
            let prodEstilosVida = req.body.prod_estilosVida;
            // remover estilos viejos
            await ProductoEstiloVida.destroy({where: {producto_id: idProd}})
            // agregar estilos nuevos
            for(let i = 0; i < prodEstilosVida.length; i++){
                await prodNuevo.addEstiloVida(prodEstilosVida[i])
            }

            /*** Imagenes ***/
            let prodImagenes = req.files;
            console.log(prodImagenes)
            // agregar nuevas fotos
            for(let i = 0; i < prodImagenes.length; i++){
                await ProductoImagen.create(
                    {
                        producto_id: idProd,
                        img: "/img/products/" + prodImagenes[i].filename
                    }
                )
            }
        
            return res.redirect('/products/productDetail/' + idProd)
        }
        catch (error){
            console.log(error);
        } 
    },
    softDelete: async (req,res)=>{
        let id = req.params.id;
        try{
            let producto = await Producto.destroy({where:{id:id}})
        }
        catch (error){
            console.log(error);
        }
        return res.redirect('/products/productDetail/' + id)
    },
    hardDelete: async (req,res)=>{
        let id = req.params.id;
        try{
            let producto = await Producto.destroy({where:{id:id}, force: true})
        }
        catch (error){
        console.log(error);
        } 
        return res.redirect('/panels/manageProducts');
    },
    processActivate: async (req, res) => {
        let id = req.params.id;
        try {
            let producto = await Producto.restore({where:{id:id}})
        }
        catch (error){
            console.log(error);
        }
        return res.redirect('/panels/manageProducts/')
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