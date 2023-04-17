// Tablas de la base de datos
const db = require('../database/models');
const Usuario = db.Usuario;

//controlador
const controller = {
    listUsers: async (req, res) => {
        let response = {}
        try {
            let users = await Usuario.findAll({
                attributes: ["id", "nombre", "email", "img", "deleted_at"],
                paranoid: false
            })

            if (users.length > 1) {
                let host = "";
                if (req.rawHeaders.length > 1) {
                    host = req.rawHeaders[1]
                }

                let usersDetail = users.map(elem => {
                    let user = {
                        id: elem.id,
                        nombre: elem.nombre,
                        email: elem.email,
                        img: elem.img,
                        detail: `${host}/users/userDetail/${elem.id}`,
                        deleted_at: elem.deleted_at
                    }
                    return user
                })
        
                response.info = {
                    status: 200,
                    count: users.length
                }
                response.users = usersDetail;
            } else {
                response.info = {
                    status: 404,
                    description: "No existen usuarios"
                }
            }
        } catch (error) {
            response.info = {
                status: 500,
                description: error
            }

            console.log(error);
        }

        res.json(response);
    },
    userDetail: async (req, res) => {
        let response = {}

        try {
            const userId = req.params.id;

            let userBase = await Usuario.findByPk(userId, {
                attributes: ["id", "nombre", "email", "img", "created_at", "updated_at", "deleted_at"],
                paranoid: false
            })

            if (userBase) {
                let host = "";
                if (req.rawHeaders.length > 1) {
                    host = req.rawHeaders[1]
                }
                response.info = {
                    status: 200,
                    id: userBase.id,
                    nombre: userBase.nombre,
                    email: userBase.email,
                    img: `${host}${userBase.img}`,
                    created_at: userBase.created_at,
                    updated_at: userBase.updated_at,
                    deleted_at: userBase.deleted_at,
                    filters: [
                        {
                            field: `Usuario id`,
                            value: userId
                        }
                    ]
                }
            } else {
                response.info = {
                    status: 404,
                    description: "No existe el usuario seleccionado",
                    filters: [
                        {
                            field: `Usuario id`,
                            value: userId
                        }
                    ]
                }
            }
        } catch (error) {
            response.info = {
                status: 500,
                description: error
            }

            console.log(error);
        }

        res.json(response);
    }
}
module.exports = controller;

