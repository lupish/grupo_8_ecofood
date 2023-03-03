const path = require('path')
const fs = require('fs');
const { validationResult } = require('express-validator');
const db = require('../database/models');
const Categoria = db.Categoria;

const controller = {
    create: (req, res) => {
        res.render('categorias/create');
    },
    processCreate: async (req, res) => {
        // chequeo validaciones middleware
        const valRes = validationResult(req)
        if (valRes.errors.length > 0) {
            return res.render('categorias/create', { errors: valRes.mapped(), oldData: req.body })
        }
        const repetida = await Categoria.findAll
          ({ where:{
                nombre: req.body.categoria_nombre
            }})
            console.log(repetida);
        // chequear unicidad
         if (repetida.length > 0) {
        console.log('svfd');
       
            let categoriaRepetida = {
                categoria_nombre: {
                    msg: "La categoría ingresada ya existe"
                }
            }
    return res.render('categorias/create', { errors: categoriaRepetida, oldData: req.body })
        }

        let imagen 
        if (req.file != undefined) {
           imagen = "/img/categorias/" + req.file.filename
        }
       try { const newCateg = await Categoria.create({
            nombre: req.body.categoria_nombre,
            img: imagen
    })    
} 
catch (error){
    console.log(error);
}
return  res.redirect("/panels/manageCategorias")       
    },
    edit: (req, res) => {
        let categoria = categoriasList.find(elem => elem.id == req.params.id);

        if (categoria) {
            res.render('categorias/edit', {categoria: categoria})
        } else {
            return  res.redirect("/panels/manageCategorias")
        }
    },
    processEdit: (req, res) => {
        // chequeo validaciones middleware
        const valRes = validationResult(req)
        if (valRes.errors.length > 0) {
            let categoria = {
                id: req.params.id,
                nombre: req.body.categoria_nombre
            }

            return res.render('categorias/edit', { errors: valRes.mapped(), categoria: categoria })
        }

        // chequear unicidad
        if (categoriasList.find(elem => elem.nombre == req.body.categoria_nombre && elem.id != req.params.id)) {
            let categoriaRepetida = {
                categoria_nombre: {
                    msg: "La categoría ingresada ya existe"
                }
            }
            let categoria = {
                id: req.params.id,
                nombre: req.body.categoria_nombre
            }
            return res.render('categorias/edit', { errors: categoriaRepetida, categoria: categoria })
        }
        
        let id = req.params.id;
        categoriasList.forEach(elem => {
            if (elem.id == id) {
                elem.nombre = req.body.categoria_nombre;
                
                if (req.file != undefined) {
                    elem.img.nombre = "/img/categorias/" + req.file.filename
                    elem.img.alt = req.file.originalname
                }
            }
        });

        fs.writeFileSync(categoriasJSON, JSON.stringify(categoriasList, null, 2));

        return  res.redirect("/panels/manageCategorias")
    },
    softDelete: async (req,res)=>{
        let id = req.params.id;
        try {const categoria = await Categoria.destroy({
            where: {
                id: id
            }
        })} 
        catch (error){
            console.log(error);
        }
        return  res.redirect("/panels/manageCategorias")
    },
    hardDelete:(req,res)=>{
        let id = req.params.id;

        let categoriasNotDelete=categoriasList.filter(row=>{return row.id!=id})

        fs.writeFileSync(categoriasJSON, JSON.stringify(categoriasNotDelete, null, 2));

        return  res.redirect("/panels/manageCategorias")
    },
    processActivate: (req, res) => {
        let id = req.params.id;
       
        categoriasList.forEach(elem => {
            if (elem.id == id) {
                elem.delete = false;
            }
        });

        fs.writeFileSync(categoriasJSON, JSON.stringify(categoriasList, null, 2));

        return  res.redirect("/panels/manageCategorias")
    }
}

module.exports = controller;