const db = require('../database/models');
 // bd productos
 const Producto = db.Producto;

 // bd imagenes de productos
const ProductoImagen = db.ProductoImagen

 // bd categorias
 const Categoria = db.Categoria;
 
 // bd estilosVida
 const EstiloVida = db.EstiloVida;
 
 // bd marcas
 const Marca = db.Marca;

// bd users
const Usuario = db.Usuario


const controller = {
    manageEcoFood: (req, res) => {
        res.render('panels/manageEcoFood')
    },
    manageProducts: async (req, res) => {
        try{
            const prods = await Producto.findAll({include: [{association: 'ProductoImagen'}]}, {paranoid: false} )
            console.log(prods);
            res.render('panels/manageProducts', {prods: prods})
        }
        catch (error){
            console.log(error);
        };
        // res.render('panels/manageProducts', {estilosVida: estilosVida, prods: products, marcas: marcas})
    },
    manageBrands: async (req, res) => {
        try{
            const list = await Marca.findAll({paranoid: false})
            res.render('panels/manageBrands', {marcas: list})
            }
            catch (error){
                console.log(error);
            };
    },
    manageEstilosVida: async (req, res) => {
        try{
            const list = await EstiloVida.findAll({paranoid: false})
            res.render('panels/manageLifeStyles', {estilosVida: list})
        }
        catch (error){
            console.log(error);
        };
        
    },
    manageCategorias: async (req, res) => {
        try{
        const list = await Categoria.findAll({paranoid: false})
        res.render('panels/manageCategoria', {categorias: list})
        }
        catch (error){
            console.log(error);
        };
    },
    manageUsers: async (req, res) => {
        const users = await Usuario.findAll({paranoid: false});
        res.render('panels/manageUsers', {users: users})
    }
}

module.exports = controller;