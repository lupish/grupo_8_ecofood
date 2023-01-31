const path = require('path')
const fs = require('fs');

// bd marcas
const marcasJSON = path.join(__dirname,'../data/marcasDB.json');
const marcas = JSON.parse(fs.readFileSync(marcasJSON, 'utf-8'));

const controller = {
    create: (req, res) => {
        res.render('brands/create');
    },
    processCreate: (req, res) => {
        // VER QUE LA MARCA NO EXISTA YA
        let marcaId = marcas[marcas.length-1].id + 1;

        let marca = {
            id: marcaId,
            nombre: req.body.marca_nombre,
            delete: false
        }

        console.log(req.body)
        console.log(req.file)
        if (req.file != undefined) {
            marca.img = "/img/brands/" + req.file.filename
            marca.alt = req.file.originalname
        } else {
            marca.img = ""
            marca.alt = ""
        }



        // Guardar producto en la bd
        marcas.push(marca);
        fs.writeFileSync(marcasJSON, JSON.stringify(marcas, null, 2));

        return res.redirect("/panels/manageBrands")

    },
    edit: (req, res) => {
        let marca = marcas.find(elem => elem.id == req.params.id);

        if (marca) {
            res.render('brands/edit', {marca: marca})
        } else {
            return res.redirect('/products/product-not-found');
        }
    },
    processEdit: (req, res) => {
        let id = req.params.id;
        marcas.forEach(elem => {
            if (elem.id == id) {
                elem.nombre = req.body.marca_nombre;
                
                if (req.file != undefined) {
                    elem.img = "/img/brands/" + req.file.filename
                    elem.alt = req.file.originalname
                } else {
                    elem.img = ""
                    elem.alt = ""
                }
            }
        });

        fs.writeFileSync(marcasJSON, JSON.stringify(marcas, null, 2));

        return res.redirect("/panels/manageBrands")
    },
    softDelete:(req,res)=>{
        let id = req.params.id;

        marcas.forEach(elem => {
            if (elem.id == id) {
                elem.delete=true;
            }
        });

        fs.writeFileSync(marcasJSON, JSON.stringify(marcas, null, 2));

        return res.redirect('/panels/manageBrands/')
    },
    hardDelete:(req,res)=>{
        let id = req.params.id;

        let marcasNotDelete=marcas.filter(row=>{return row.id!=id})

        fs.writeFileSync(marcasJSON, JSON.stringify(marcasNotDelete, null, 2));

        return res.redirect('/panels/manageBrands/')
    },
    processActivate: (req, res) => {
        let id = req.params.id;
       
        marcas.forEach(elem => {
            if (elem.id == id) {
                elem.delete = false;
            }
        });

        fs.writeFileSync(marcasJSON, JSON.stringify(marcas, null, 2));

        return res.redirect('/panels/manageBrands/')
    }
}

module.exports = controller;