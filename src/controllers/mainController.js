// base de datos
const db = require('../database/models');
const Producto = db.Producto;
const EstiloVida = db.EstiloVida;

const controller = {
    home: async (req, res) => {
        try {
            let estilosVida = await EstiloVida.findAll()
            let prodsEcoFood = await Producto.findAll({
                include: [
                    {association: 'ProductoImagen'},
                    {association: 'Marca'}
                ]
            });
            res.render('home', {
                prodsEcoFood: prodsEcoFood,
                estilosVida: estilosVida
            })
        }
        catch(error){
            console.log(error);
        }
     },
    nosotros: (req, res) => {
        res.render('nosotros');
    },
    contacto: (req, res) => {
        res.render('contacto');
    }
}

module.exports = controller;