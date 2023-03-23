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


// const path = require('path')
// const fs = require('fs');
// const { validationResult } = require('express-validator');

// // bd marcas
// const estilosVidaJSON = path.join(__dirname,'../data/estilosVidaDB.json');
// const estilosVida = JSON.parse(fs.readFileSync(estilosVidaJSON, 'utf-8'));

// const controller = {
//     create: (req, res) => {
//         res.render('lifeStyles/create');
//     },
//     processCreate: (req, res) => {
//         // chequeo validaciones middleware
//         const valRes = validationResult(req)
//         if (valRes.errors.length > 0) {
//             return res.render('lifeStyles/create', { errors: valRes.mapped(), oldData: req.body })
//         }

//         // chequear unicidad
//         if (estilosVida.find(elem => elem.nombre == req.body.estiloVida_nombre)) {
//             let estiloVidaRepetido = {
//                 estiloVida_nombre: {
//                     msg: "El estilo de vida ingresado ya existe"
//                 }
//             }
//             return res.render('lifeStyles/create', { errors: estiloVidaRepetido, oldData: req.body })
//         }

//         let estiloVidaId = estilosVida[estilosVida.length-1].id + 1;

//         let estiloVida = {
//             id: estiloVidaId,
//             nombre: req.body.estiloVida_nombre,
//             delete: false
//         }

//         if (req.file != undefined) {
//             estiloVida.img = "/img/estilosVida/" + req.file.filename
//             estiloVida.alt = req.file.originalname
//         } else {
//             estiloVida.img = ""
//             estiloVida.alt = ""
//         }

//         // Guardar estilo de vida en la bd
//         estilosVida.push(estiloVida);
//         fs.writeFileSync(estilosVidaJSON, JSON.stringify(estilosVida, null, 2));

//         return res.redirect("/panels/manageLifeStyles")

//     },
//     edit: (req, res) => {
//         let estiloVida = estilosVida.find(elem => elem.id == req.params.id);

//         if (estiloVida) {
//             res.render('lifeStyles/edit', {estiloVida: estiloVida})
//         } else {
//             return res.redirect('/products/product-not-found');
//         }
//     },
//     processEdit: (req, res) => {
//         // chequeo validaciones middleware
//         const valRes = validationResult(req)
//         if (valRes.errors.length > 0) {
//             let estiloVida = {
//                 id: req.params.id,
//                 nombre: req.body.estiloVida_nombre
//             }
//             return res.render('lifeStyles/edit', { errors: valRes.mapped(), estiloVida: estiloVida })
//         }

//         // chequear unicidad
//         if (estilosVida.find(elem => elem.nombre == req.body.estiloVida_nombre && elem.id != req.params.id)) {
//             let estiloVidaRepetido = {
//                 estiloVida_nombre: {
//                     msg: "El estilo de vida ingresado ya existe"
//                 }
//             }
//             let estiloVida = {
//                 id: req.params.id,
//                 nombre: req.body.estiloVida_nombre
//             }
//             return res.render('lifeStyles/edit', { errors: estiloVidaRepetido, estiloVida: estiloVida })
//         }
        
//         let id = req.params.id;
//         estilosVida.forEach(elem => {
//             if (elem.id == id) {
//                 elem.nombre = req.body.estiloVida_nombre;
                
//                 if (req.file != undefined) {
//                     elem.img = "/img/estilosVida/" + req.file.filename
//                     elem.alt = req.file.originalname
//                 }
//             }
//         });

//         fs.writeFileSync(estilosVidaJSON, JSON.stringify(estilosVida, null, 2));

//         return res.redirect("/panels/manageLifeStyles")
//     },
//     softDelete:(req,res)=>{
//         let id = req.params.id;

//         estilosVida.forEach(elem => {
//             if (elem.id == id) {
//                 elem.delete=true;
//             }
//         });

//         fs.writeFileSync(estilosVidaJSON, JSON.stringify(estilosVida, null, 2));

//         return res.redirect('/panels/managelifeStyles/')
//     },
//     hardDelete:(req,res)=>{
//         let id = req.params.id;

//         let estilosVidaNotDelete=estilosVida.filter(row=>{return row.id!=id})

//         fs.writeFileSync(estilosVidaJSON, JSON.stringify(estilosVidaNotDelete, null, 2));

//         return res.redirect('/panels/managelifeStyles/')
//     },
//     processActivate: (req, res) => {
//         let id = req.params.id;
       
//         estilosVida.forEach(elem => {
//             if (elem.id == id) {
//                 elem.delete = false;
//             }
//         });

//         fs.writeFileSync(estilosVidaJSON, JSON.stringify(estilosVida, null, 2));

//         return res.redirect('/panels/managelifeStyles/')
//     }
// }

// module.exports = controller;