const path = require('path')
const fs = require('fs');
const { validationResult } = require('express-validator');

// bd marcas
const estilosVidaJSON = path.join(__dirname,'../data/estilosVidaDB.json');
const estilosVida = JSON.parse(fs.readFileSync(estilosVidaJSON, 'utf-8'));

const controller = {
    create: (req, res) => {
        res.render('lifeStyles/create');
    },
    processCreate: (req, res) => {
        // chequeo validaciones middleware
        const valRes = validationResult(req)
        if (valRes.errors.length > 0) {
            return res.render('lifeStyles/create', { errors: valRes.mapped(), oldData: req.body })
        }

        // chequear unicidad
        if (estilosVida.find(elem => elem.nombre == req.body.estiloVida_nombre)) {
            let estiloVidaRepetido = {
                estiloVida_nombre: {
                    msg: "El estilo de vida ingresado ya existe"
                }
            }
            return res.render('lifeStyles/create', { errors: estiloVidaRepetido, oldData: req.body })
        }

        let estiloVidaId = estilosVida[estilosVida.length-1].id + 1;

        let estiloVida = {
            id: estiloVidaId,
            nombre: req.body.estiloVida_nombre,
            delete: false
        }

        if (req.file != undefined) {
            estiloVida.img = "/img/estilosVida/" + req.file.filename
            estiloVida.alt = req.file.originalname
        } else {
            estiloVida.img = ""
            estiloVida.alt = ""
        }

        // Guardar estilo de vida en la bd
        estilosVida.push(estiloVida);
        fs.writeFileSync(estilosVidaJSON, JSON.stringify(estilosVida, null, 2));

        return res.redirect("/panels/manageLifeStyles")

    },
    edit: (req, res) => {
        let estiloVida = estilosVida.find(elem => elem.id == req.params.id);

        if (estiloVida) {
            res.render('lifeStyles/edit', {estiloVida: estiloVida})
        } else {
            return res.redirect('/products/product-not-found');
        }
    },
    processEdit: (req, res) => {
        console.log("PROCESS EDIT")
        
        // chequeo validaciones middleware
        const valRes = validationResult(req)
        console.log(valRes.mapped())
        if (valRes.errors.length > 0) {
            let estiloVida = {
                id: req.params.id,
                nombre: req.body.estiloVida_nombre
            }
            return res.render('lifeStyles/edit', { errors: valRes.mapped(), estiloVida: estiloVida })
        }

        // chequear unicidad
        if (estilosVida.find(elem => elem.nombre == req.body.estiloVida_nombre && elem.id != req.params.id)) {
            let estiloVidaRepetido = {
                estiloVida_nombre: {
                    msg: "El estilo de vida ingresado ya existe"
                }
            }
            let estiloVida = {
                id: req.params.id,
                nombre: req.body.estiloVida_nombre
            }
            console.log(estiloVidaRepetido)
            return res.render('lifeStyles/edit', { errors: estiloVidaRepetido, estiloVida: estiloVida })
        }
        
        let id = req.params.id;
        estilosVida.forEach(elem => {
            if (elem.id == id) {
                elem.nombre = req.body.estiloVida_nombre;
                
                if (req.file != undefined) {
                    elem.img = "/img/estilosVida/" + req.file.filename
                    elem.alt = req.file.originalname
                }
            }
        });

        fs.writeFileSync(estilosVidaJSON, JSON.stringify(estilosVida, null, 2));

        return res.redirect("/panels/manageLifeStyles")
    },
    softDelete:(req,res)=>{
        let id = req.params.id;

        estilosVida.forEach(elem => {
            if (elem.id == id) {
                elem.delete=true;
            }
        });

        fs.writeFileSync(estilosVidaJSON, JSON.stringify(estilosVida, null, 2));

        return res.redirect('/panels/managelifeStyles/')
    },
    hardDelete:(req,res)=>{
        let id = req.params.id;

        let estilosVidaNotDelete=estilosVida.filter(row=>{return row.id!=id})

        fs.writeFileSync(estilosVidaJSON, JSON.stringify(estilosVidaNotDelete, null, 2));

        return res.redirect('/panels/managelifeStyles/')
    },
    processActivate: (req, res) => {
        let id = req.params.id;
       
        estilosVida.forEach(elem => {
            if (elem.id == id) {
                elem.delete = false;
            }
        });

        fs.writeFileSync(estilosVidaJSON, JSON.stringify(estilosVida, null, 2));

        return res.redirect('/panels/managelifeStyles/')
    }
}

module.exports = controller;