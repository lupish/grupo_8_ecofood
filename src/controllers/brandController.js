const { validationResult } = require('express-validator');
const db = require('../database/models');
const sequelize = db.sequelize;
const Marca = db.Marca;
const { Op } = require("sequelize");

const controller = {
    create: (req, res) => {
        res.render('brands/create');
    },
    processCreate: async (req, res) => {
        const t = await sequelize.transaction();
        try{
        // chequeo validaciones middleware
        const valRes = validationResult(req)
        if (valRes.errors.length > 0) {
            return res.render('brands/create', { errors: valRes.mapped(), oldData: req.body })
        }
        // chequear unicidad
        let repetida = await Marca.findAll({where:{nombre: req.body.marca_nombre}})
        if (repetida.length > 0){
            let marcaRepetida = {
                marca_nombre: {
                    msg: "La marca ingresada ya existe"
                }  
        }
        return res.render('brands/create', { errors: marcaRepetida, oldData: req.body })
        }
        let imagen 
        if(req.file != undefined){
            imagen = "/img/brands/" + req.file.filename
        }
        
            const newBrand = await Marca.create({
                nombre: req.body.marca_nombre,
                img: imagen
            },{transaction: t})
            await t.commit();
            return res.redirect("/panels/manageBrands");
        }
        catch (error){
            await t.rollback();
            console.log(error);
        }    
    },
    edit: async (req, res) => {
        const t = await sequelize.transaction();
        try {
        let id = req.params.id;
        let marca = await Marca.findByPk(id, {transaction: t, paranoid: false})
        if (marca) {
            await t.commit();
            res.render('brands/edit', {marca: marca})
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
        try { 
            let marcaVieja = await Marca.findByPk(req.params.id, {paranoid: false});

            // chequeo validaciones middleware
            const valRes = validationResult(req)
            if (valRes.errors.length > 0) {
                let marca = {
                    id: req.params.id,
                    nombre: req.body.marca_nombre,
                    img: marcaVieja.img
                }   
                return res.render('brands/edit', { errors: valRes.mapped(), marca: marca })
            }
            // chequear unicidad
            let repetida = await Marca.findAll({
                where: {id:{[Op.ne]:req.params.id}, nombre: req.body.marca_nombre}
                ,paranoid: false
            })
            if(repetida.length > 0){
                let marcaRepetida = {
                    marca_nombre: {
                        msg: "La marca ingresada ya existe"
                    }
                }
                let marca = {
                    id: req.params.id,
                    nombre: req.body.marca_nombre,
                    img: marcaVieja.img
                }
                return res.render('brands/edit', { errors: marcaRepetida, marca: marca }) 
            }
            let id = req.params.id;
            let imagen 
            if (req.file != undefined) {
                imagen = "/img/brands/" + req.file.filename
            }
        
            const updateBrand = await Marca.update({
                nombre: req.body.marca_nombre,
                img: imagen
            }, {
                where: {
                    id: id
                }, paranoid: false
            },
            {transaction: t})
            await t.commit();
            return  res.redirect("/panels/manageBrands")
       }
       catch (error){
            await t.rollback();
            console.log(error);
       }  
    },
    softDelete: async (req,res)=>{
        const t = await sequelize.transaction();
        let id = req.params.id;
        try{
            let marca = await Marca.destroy({where:{id:id}}, {transaction: t})
            await t.commit();
            return res.redirect('/panels/manageBrands/');
        }
        catch (error){
            await t.rollback();
            console.log(error);
        }
    },
    hardDelete: async (req,res)=>{
        const t = await sequelize.transaction();
        let id = req.params.id;
        try{
            let marca = await Marca.destroy({where:{id:id}, force: true},{transaction: t})
            await t.commit();
            return res.redirect('/panels/manageBrands/');
        }
        catch (error){
            await t.rollback();
            console.log(error);
        }    
    },
    processActivate: async (req, res) => {
        const t = await sequelize.transaction();
        let id = req.params.id;
        try{
            let marca = await Marca.restore({where:{id:id}},{transaction: t})
            await t.commit();
            return res.redirect('/panels/manageBrands/');
        }
        catch(error){
            await t.rollback();
            console.log(error);
        } 
    }
}

module.exports = controller;