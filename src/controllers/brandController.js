const { validationResult } = require('express-validator');
const db = require('../database/models');
const Marca = db.Marca;
const { Op } = require("sequelize");

const controller = {
    create: (req, res) => {
        res.render('brands/create');
    },
    processCreate: async (req, res) => {
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
        try{
            const newBrand = await Marca.create({
                nombre: req.body.marca_nombre,
                img: imagen
            })
        }
        catch (error){
            console.log(error);
        }
        return res.redirect("/panels/manageBrands");
    },
    edit: async (req, res) => {
        let id = req.params.id;
        let marca = await Marca.findByPk(id)
        if (marca) {
            res.render('brands/edit', {marca: marca})
        } else {
            return res.redirect('/products/product-not-found');
        }
    },
    processEdit: async (req, res) => {
        // console.log(req.body);
        // chequeo validaciones middleware
        const valRes = validationResult(req)
        if (valRes.errors.length > 0) {
            let marca = {
                id: req.params.id,
                nombre: req.body.marca_nombre
            }   
            return res.render('brands/edit', { errors: valRes.mapped(), marca: marca })
        }

        // chequear unicidad
        let repetida = await Marca.findAll({where:{id:{[Op.ne]:req.params.id}, nombre: req.body.marca_nombre}})
        if(repetida.length > 0){
            let marcaRepetida = {
                marca_nombre: {
                    msg: "La marca ingresada ya existe"
                }
            }
            let marca = {
                id: req.params.id,
                nombre: req.body.marca_nombre
            }
            return res.render('brands/edit', { errors: marcaRepetida, marca: marca }) 
        }
        let id = req.params.id;
        let imagen 
        if (req.file != undefined) {
           imagen = "/img/brands/" + req.file.filename
        }
        try {
            const updateBrand = await Marca.update({
            nombre: req.body.marca_nombre,
            img: imagen
        }, {
            where: {
                id: id
            }
        })
     
    }
        catch (error){
            console.log(error);
        }
        return  res.redirect("/panels/manageBrands")
    },
    softDelete: async (req,res)=>{
        let id = req.params.id;
        try{
            let marca = await Marca.destroy({where:{id:id}})
        }
        catch (error){
            console.log(error);
        }
        return res.redirect('/panels/manageBrands/');
    },
    hardDelete: async (req,res)=>{
        let id = req.params.id;
        try{
            let marca = await Marca.destroy({where:{id:id}, force: true})
        }
        catch (error){
            console.log(error);
        }
        return res.redirect('/panels/manageBrands/');
    },
    processActivate: async (req, res) => {
        let id = req.params.id;
        try{
            let marca = await Marca.restore({where:{id:id}})
        }
        catch(error){
            console.log(error);
        }
        return res.redirect('/panels/manageBrands/');
    }
}

module.exports = controller;

// const path = require('path')
// const fs = require('fs');
// const { validationResult } = require('express-validator');

// // bd marcas
// const marcasJSON = path.join(__dirname,'../data/marcasDB.json');
// const marcas = JSON.parse(fs.readFileSync(marcasJSON, 'utf-8'));

// const controller = {
//     create: (req, res) => {
//         res.render('brands/create');
//     },
//     processCreate: (req, res) => {
//         // chequeo validaciones middleware
//         const valRes = validationResult(req)
//         if (valRes.errors.length > 0) {
//             return res.render('brands/create', { errors: valRes.mapped(), oldData: req.body })
//         }

//         // chequear unicidad
//         if (marcas.find(elem => elem.nombre == req.body.marca_nombre)) {
//             let marcaRepetida = {
//                 marca_nombre: {
//                     msg: "La marca ingresada ya existe"
//                 }
//             }
//             return res.render('brands/create', { errors: marcaRepetida, oldData: req.body })
//         }

//         let marcaId = marcas[marcas.length-1].id + 1;

//         let marca = {
//             id: marcaId,
//             nombre: req.body.marca_nombre,
//             delete: false
//         }

//         if (req.file != undefined) {
//             marca.img = "/img/brands/" + req.file.filename
//             marca.alt = req.file.originalname
//         }

//         // Guardar producto en la bd
//         marcas.push(marca);
//         fs.writeFileSync(marcasJSON, JSON.stringify(marcas, null, 2));

//         return res.redirect("/panels/manageBrands")

//     },
//     edit: (req, res) => {
//         let marca = marcas.find(elem => elem.id == req.params.id);

//         if (marca) {
//             res.render('brands/edit', {marca: marca})
//         } else {
//             return res.redirect('/products/product-not-found');
//         }
//     },
//     processEdit: (req, res) => {
//         // chequeo validaciones middleware
//         const valRes = validationResult(req)
//         if (valRes.errors.length > 0) {
//             let marca = {
//                 id: req.params.id,
//                 nombre: req.body.marca_nombre
//             }
            
//             return res.render('brands/edit', { errors: valRes.mapped(), marca: marca })
//         }

//         // chequear unicidad
//         if (marcas.find(elem => elem.nombre == req.body.marca_nombre && elem.id != req.params.id)) {
//             let marcaRepetida = {
//                 marca_nombre: {
//                     msg: "La marca ingresada ya existe"
//                 }
//             }
//             let marca = {
//                 id: req.params.id,
//                 nombre: req.body.marca_nombre
//             }
//             return res.render('brands/edit', { errors: marcaRepetida, marca: marca })
//         }

//         let id = req.params.id;
//         marcas.forEach(elem => {
//             if (elem.id == id) {
//                 elem.nombre = req.body.marca_nombre;
                
//                 if (req.file != undefined) {
//                     elem.img = "/img/brands/" + req.file.filename
//                     elem.alt = req.file.originalname
//                 } else {
//                     elem.img = ""
//                     elem.alt = ""
//                 }
//             }
//         });

//         fs.writeFileSync(marcasJSON, JSON.stringify(marcas, null, 2));

//         return res.redirect("/panels/manageBrands")
//     },
//     softDelete:(req,res)=>{
//         let id = req.params.id;

//         marcas.forEach(elem => {
//             if (elem.id == id) {
//                 elem.delete=true;
//             }
//         });

//         fs.writeFileSync(marcasJSON, JSON.stringify(marcas, null, 2));

//         return res.redirect('/panels/manageBrands/')
//     },
//     hardDelete:(req,res)=>{
//         let id = req.params.id;

//         let marcasNotDelete=marcas.filter(row=>{return row.id!=id})

//         fs.writeFileSync(marcasJSON, JSON.stringify(marcasNotDelete, null, 2));

//         return res.redirect('/panels/manageBrands/')
//     },
//     processActivate: (req, res) => {
//         let id = req.params.id;
       
//         marcas.forEach(elem => {
//             if (elem.id == id) {
//                 elem.delete = false;
//             }
//         });

//         fs.writeFileSync(marcasJSON, JSON.stringify(marcas, null, 2));

//         return res.redirect('/panels/manageBrands/')
//     }
// }

// module.exports = controller;