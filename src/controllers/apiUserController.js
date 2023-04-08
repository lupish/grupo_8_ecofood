// Tablas de la base de datos
const db = require('../database/models');
const Usuario = db.Usuario;

//controlador
const controller = {
    listUsers: async (req, res) => {
        let response = {}
        try {
            let users = await Usuario.findAll({            
                include: [{association: 'rol'}],
                attributes: ["nombre", "email", "img"],
                paranoid: false
            })

            response.info = {
                status: 200,
                quantity: users.length
            }
    
            response.data = users;
        } catch (error) {
            response.info = {
                status: 500,
                description: error
            }

            console.log(error)
        }

        res.json(response)
    }
}
module.exports = controller;

