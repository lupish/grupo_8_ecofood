// Tablas de la base de datos
const db = require('../database/models');
const Usuario = db.Usuario;

//controlador
const controller = {
    listUsers: async (req, res) => {
        let response = {}
        
        // obtener campos de paginacion
        const size = parseInt(req.query.size) || 10;
        const page = parseInt(req.query.page) || 1;
        let offset = size * (page-1);
        const sortField = req.query.sortField || "id";
        const sortType = req.query.sortType || "ASC";
        const order = [sortField, sortType]

        if (!(sortField == "id" | sortField == "nombre" || sortField == "precio")) {
            return res.json({
                status: 400,
                description: "El campo sortField debe ser: id o nombre o precio",
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
        let usersPage = 0;

        try {
            const usersCount = await Usuario.findAll({paranoid: false})
            let users = await Usuario.findAll({
                attributes: ["id", "nombre", "email", "img", "deleted_at"],
                paranoid: false,
                limit: size,
                offset: offset,
                order: [order]
            })

            usersPage = users.length;

            if (users.length > 0) {
                let usersDetail = users.map(elem => {
                    let user = {
                        id: elem.id,
                        nombre: elem.nombre,
                        email: elem.email,
                        img: elem.img,
                        detail: `/api/users/${elem.id}`,
                        deleted_at: elem.deleted_at
                    }
                    return user
                })
        
                response = {
                    status: 200,
                    count: usersCount.length
                }
                response.users = usersDetail;
            } else {
                response = {
                    status: 404,
                    description: "No existen usuarios"
                }
            }

            // paginado
            response.paging = {
                page: page,
                size: size,
                count: usersPage,
                order: order
            }

            if (usersPage > 0 && page > 1) {
                response.paging.prev = `/api/users/?page=${page - 1}&size=${size}&sortField=${sortField}&sortType=${sortType}`
            }
            if (usersPage > 0 && usersCount.length > (offset+size)) {
                response.paging.next = `/api/users/?page=${page + 1}&size=${size}&sortField=${sortField}&sortType=${sortType}`
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
    userDetail: async (req, res) => {
        let response = {}

        try {
            const userId = req.params.id;

            let userBase = await Usuario.findByPk(userId, {
                attributes: ["id", "nombre", "email", "img", "created_at", "updated_at", "deleted_at"],
                paranoid: false
            })

            console.log(userBase)

            if (userBase) {
                response = {
                    status: 200,
                    ...userBase.dataValues,
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

