module.exports = (sequelize, dataTypes) => {
    let alias = 'ProductoFactura';
    let cols = {
        id: {
            type: dataTypes.BIGINT(20).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        factura_id:{
            type: dataTypes.BIGINT(20).UNSIGNED
        }, 
        producto_id:{
            type: dataTypes.BIGINT(20).UNSIGNED
        }, 
        cantidad:{
            type: dataTypes.BIGINT(20)
        },
        precio: {
            type: dataTypes.FLOAT
        }
    };
    let config = {
        tableName: "productofactura",
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true
    };
    const ProductoFactura = sequelize.define(alias, cols, config); 

    return ProductoFactura;
};