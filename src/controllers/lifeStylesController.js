const { validationResult } = require('express-validator');
const db = require('../database/models');
const EstiloVida = db.EstiloVida;
const sequelize = db.sequelize;
const { Op } = require("sequelize");

const controller = {
    create: (req, res) => {
        res.render('lifeStyles/create');
    },
    processCreate: async (req, res) => {
        const t = await sequelize.transaction();
         try{
            // chequeo validaciones middleware
            const valRes = validationResult(req)
            if (valRes.errors.length > 0) {
                return res.render('lifeStyles/create', { errors: valRes.mapped(), oldData: req.body })
            }

            // chequear unicidad
            let repetida = await EstiloVida.findAll({where:{nombre: req.body.estiloVida_nombre}})
            if(repetida.length > 0){
                let estiloVidaRepetido = {
                    estiloVida_nombre: {
                        msg: "El estilo de vida ingresado ya existe"
                    }
                }
                return res.render('lifeStyles/create', { errors: estiloVidaRepetido, oldData: req.body })  
            }
            let imagen 
            if (req.file != undefined) {
            imagen = "/img/estilosVida/" + req.file.filename
            }
        
            let newLifeStyle = await EstiloVida.create({
                nombre: req.body.estiloVida_nombre,
                img: imagen
            },{transaction: t})
            await t.commit();
            return res.redirect("/panels/manageLifeStyles")
        }
        catch (error){
            await t.rollback();
            console.log(error);
        }   
    },
    edit: async (req, res) => {
        const t = await sequelize.transaction();
        try{
        let estiloVida = await EstiloVida.findByPk(req.params.id,{transaction: t})
        if (estiloVida) {
            await t.commit();
            return res.render('lifeStyles/edit', {estiloVida: estiloVida})
        } else {
            return res.redirect('/products/product-not-found');
        }
        }  
        catch (error){
            await t.rollback();
            console.log(error);
        } 
    },
    processEdit: async (req, res) => {
        const t = await sequelize.transaction();
        try{
            const estiloViejo = await EstiloVida.findByPk(req.params.id);

            // chequeo validaciones middleware
            const valRes = validationResult(req)
            if (valRes.errors.length > 0) {
                let estiloVida = {
                    id: req.params.id,
                    nombre: req.body.estiloVida_nombre,
                    img: estiloViejo.img
                }
                return res.render('lifeStyles/edit', { errors: valRes.mapped(), estiloVida: estiloVida })
            }

            // chequear unicidad
            let repetida = await EstiloVida.findAll({where:{id:{[Op.ne]: req.params.id}, nombre: req.body.estiloVida_nombre}})
            if(repetida.length > 0){
                let estiloVidaRepetido = {
                    estiloVida_nombre: {
                        msg: "El estilo de vida ingresado ya existe"
                    }
                }
                let estiloVida = {
                    id: req.params.id,
                    nombre: req.body.estiloVida_nombre,
                    img: estiloViejo.img
                }
                return res.render('lifeStyles/edit', { errors: estiloVidaRepetido, estiloVida: estiloVida })
            }
        let imagen 
        if (req.file != undefined) {
            imagen = "/img/estilosVida/" + req.file.filename
        }  
        
            let updateLifeStyle = EstiloVida.update({
                nombre: req.body.estiloVida_nombre,
                img: imagen
            },{where: {id: req.params.id}},{transaction: t})
            await t.commit();
            return res.redirect("/panels/manageLifeStyles")
       }
       catch (error){
            await t.rollback();
            console.log(error);
       }   
    },
    softDelete: async (req,res)=>{
        const t = await sequelize.transaction();
        try{
            let estiloVida = await EstiloVida.destroy({where: {id: req.params.id}},{transaction: t}) 
            await t.commit();
            return res.redirect('/panels/managelifeStyles/')
        }
        catch (error){
            await t.rollback();
            console.log(error);
        }   
    },
    hardDelete: async (req,res)=>{
        const t = await sequelize.transaction();
        try{
            let estiloVida = await EstiloVida.destroy({where: {id: req.params.id}, force: true}, {transaction: t})
            await t.commit();
            return res.redirect('/panels/managelifeStyles/')
        }
        catch (error){
            await t.rollback();
            console.log(error);
        }    
    },
    processActivate:  async (req,res)=>{
        const t = await sequelize.transaction();
        try{
            let estiloVida = await EstiloVida.restore({where: {id: req.params.id}},{transaction: t})
            await t.commit();
            return res.redirect('/panels/managelifeStyles/')
        }
        catch (error){
            await t.rollback();
            console.log(error);
        }   
    }
}

module.exports = controller;