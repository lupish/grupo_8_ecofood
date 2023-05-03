module.exports = (sequelize, dataTypes) => {
    let alias = 'Producto';
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
        categoria_id: {
            type: dataTypes.BIGINT
        },
        marca_id: {
            type: dataTypes.BIGINT
        },
        precio: {
            type: dataTypes.FLOAT
        },
        descripcionCorta: {
            type: dataTypes.STRING(255)
        },
        descripcionLarga: {
            type: dataTypes.TEXT
        },
    };
    let config = {
        tableName: "producto",
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true
    }
    const Producto = sequelize.define(alias, cols, config); 

    Producto.associate = function(models){
        Producto.hasMany(models.ProductoImagen, { 
            as: "ProductoImagen",
            foreignKey: "producto_id"
        });
        Producto.belongsTo(models.Categoria, { 
            as: "Categoria",
            foreignKey: "categoria_id"
        });
        Producto.belongsTo(models.Marca, { 
            as: "Marca",
            foreignKey: "marca_id"
        });
        Producto.belongsToMany(models.EstiloVida, {
            as: 'EstiloVida',
            through: 'ProductoEstiloVida',
            foreignKey: 'producto_id',
            otherKey: 'estiloVida_id',
            timestamps: false
        });
        Producto.belongsToMany(models.Factura, {
            as: 'Factura',
            through: 'ProductoFactura',
            foreignKey: 'producto_id',
            otherKey: 'factura_id',
            timestamps: false
        })
        // falta poner factura
    }

    return Producto
};