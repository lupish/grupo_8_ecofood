module.exports = (sequelize, dataTypes) => {
    let alias = 'ProductoImagen';
    let cols = {
        id: {
            type: dataTypes.BIGINT(20).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        img: {
            type: dataTypes.STRING(255)
        },
        producto_id: {
            type: dataTypes.BIGINT(20).UNSIGNED
        }
    };
    let config = {
        tableName: "productoimagen",
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true
    };
    const ProductoImagen = sequelize.define(alias, cols, config);

    ProductoImagen.associate = function(models){
        ProductoImagen.belongsTo(models.Producto, { 
            as: "ProductoImagen",
            foreignKey: "producto_id"
        })
    }
    
    return ProductoImagen;
    
}   