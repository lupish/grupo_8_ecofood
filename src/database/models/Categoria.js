module.exports = (sequelize, dataTypes) => {
    let alias = 'Categoria';
    let cols = {
        id: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: dataTypes.STRING(255),
            allowNull: false
        },
        img: {
            type: dataTypes.STRING(255)
        }
    };
    let config = {
        tableName: "categoria",
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true
    }
    const Categoria = sequelize.define(alias, cols, config); 

    Categoria.associate = function(models) {
        Categoria.hasMany(models.Producto, { 
            as: "Producto",
            foreignKey: "categoria_id"
        })
    }

    return Categoria
};