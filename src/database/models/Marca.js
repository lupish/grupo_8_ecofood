module.exports = (sequelize, dataTypes) => {
    let alias = 'Marca';
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
        tableName: "marca",
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true
    };
    const Marca = sequelize.define(alias, cols, config); 

    Marca.associate = function(models) {
        Marca.hasMany(models.Producto, { 
            as: "Producto",
            foreignKey: "marca_id"
        })
    }

    return Marca;
};