const db = require('../database/models');
const sequelize = db.sequelize;
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
        const t = await sequelize.transaction();
        try{
            const prods = await Producto.findAll( {include: [{association: 'ProductoImagen'}], paranoid: false}, {transaction: t})
            await t.commit();
            res.render('panels/manageProducts', {prods: prods})
        }
        catch (error){
            await t.rollback();
            console.log(error);
        };
    },
    manageBrands: async (req, res) => {
        const t = await sequelize.transaction();
        try{
            const list = await Marca.findAll({paranoid: false},{transaction: t})
            await t.commit();
            res.render('panels/manageBrands', {marcas: list})
            }
            catch (error){
                await t.rollback();
                console.log(error);
            };
    },
    manageEstilosVida: async (req, res) => {
        const t = await sequelize.transaction();
        try{
            const list = await EstiloVida.findAll({paranoid: false},{transaction: t})
            await t.commit();
            res.render('panels/manageLifeStyles', {estilosVida: list})
        }
        catch (error){
            await t.rollback();
            console.log(error);
        };
        
    },
    manageCategorias: async (req, res) => {
        const t = await sequelize.transaction();
        try{
        const list = await Categoria.findAll({paranoid: false},{transaction: t})
        await t.commit();
        res.render('panels/manageCategoria', {categorias: list})
        }
        catch (error){
            await t.rollback();
            console.log(error);
        };
    },
    manageUsers: async (req, res) => {
        const t = await sequelize.transaction();
        try{
        const users = await Usuario.findAll({paranoid: false},{transaction: t});
        await t.commit();
        res.render('panels/manageUsers', {users: users})
        }
        catch (error){
            await t.rollback();
            console.log(error);
        };
    }
}

module.exports = controller;