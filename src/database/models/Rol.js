module.exports = (sequelize, dataTypes) => {
    let alias = 'Rol';
    let cols = {
        id: {
            type: dataTypes.BIGINT(20).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: dataTypes.STRING(255),
            allowNull: false
        },
        descripcion: {
            type: dataTypes.STRING(255)
        }
    };
    let config = {
        tableName: "rol",
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true
    }

    // definir el modelo
    const Rol = sequelize.define(alias, cols, config); 

    // definir relaciones
    Rol.associate = function (models) {
        Rol.hasMany(models.Usuario, {
            as: "usuarios",
            foreignKey: "rol_id"
        })
    }

    return Rol
};