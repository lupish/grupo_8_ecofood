module.exports = (sequelize, dataTypes) => {
    let alias = 'Factura';
    let cols = {
        id: {
            type: dataTypes.BIGINT(20).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        usuario_id: {
            type: dataTypes.BIGINT(20).UNSIGNED,
            allowNull: false
        },
        fecha_factura: {
            type: dataTypes.DATEONLY
        },
        total: {
            type: dataTypes.FLOAT
        }
    };
    let config = {
        tableName: "factura",
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true
    }
    const Factura = sequelize.define(alias, cols, config); 

    Factura.associate = function(models){
        Factura.belongsTo(models.Usuario, { 
            as: "Usuario",
            foreignKey: "usuario_id"
        });
        Factura.belongsToMany(models.Producto, {
            as: 'Producto',
            through: 'ProductoFactura',
            foreignKey: 'factura_id',
            otherKey: 'producto_id',
            timestamps: false
        });
        Factura.hasMany(models.ProductoFactura, {
            as: "Detalles",
            foreignKey: "factura_id"
        })
    }

    return Factura
};