module.exports = (sequelize, dataTypes) => {
    let alias = 'EstiloVida';
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
        tableName: "estilovida",
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true
    };
    const EstiloVida = sequelize.define(alias, cols, config); 

    EstiloVida.associate = function(models){
        EstiloVida.belongsToMany(models.Producto, {
            as: 'Producto',
            through: 'ProductoEstiloVida',
            foreignKey:'estiloVida_id' ,
            otherKey: 'producto_id',
            timestamps: false
        })
    }

    return EstiloVida;
};