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
                attributes: ["id", "nombre", "email", "img"],
                paranoid: false
            })

            response.info = {
                status: 200,
                count: users.length
            }
    
            response.users = users;
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

