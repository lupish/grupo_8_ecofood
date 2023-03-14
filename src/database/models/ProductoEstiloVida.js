module.exports = (sequelize, dataTypes) => {
    let alias = 'ProductoEstiloVida';
    let cols = {
        id: {
            type: dataTypes.BIGINT(20).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        producto_id:{
            type: dataTypes.BIGINT(20).UNSIGNED
        }, 
        estiloVida_id:{
            type: dataTypes.BIGINT(20).UNSIGNED
        }
    };
    let config = {
        tableName: "productoestilovida",
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true
    };
    const ProductoEstiloVida = sequelize.define(alias, cols, config); 

    return ProductoEstiloVida;
};