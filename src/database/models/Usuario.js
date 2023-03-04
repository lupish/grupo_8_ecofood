module.exports = (sequelize, dataTypes) => {
    let alias = 'Usuario';
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
        email: {
            type: dataTypes.STRING(255),
            allowNull: false
        },
        contrasenia: {
            type: dataTypes.STRING(255),
            allowNull: false
        },
        img: {
            type: dataTypes.STRING(255)
        },
        rol_id: {
            type: dataTypes.BIGINT(20).UNSIGNED,
            allowNull: false
        }
        
    };
    let config = {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true
    }

    // definir el modelo
    const Usuario = sequelize.define(alias, cols, config);

    // definir relaciones
    Usuario.associate = function (models) {
        Usuario.belongsTo(models.Rol, {
            as: "rol",
            foreignKey: "rol_id"
        })
    }

    return Usuario
};