const path = require('path')
const fs = require('fs');

// bd marcas
const estilosVidaJSON = path.join(__dirname,'../data/estilosVidaDB.json');
const estilosVida = JSON.parse(fs.readFileSync(estilosVidaJSON, 'utf-8'));

const controller = {
    create: (req, res) => {
        res.render('lifeStyles/create');
    },
    processCreate: (req, res) => {
        // VER QUE el estilo de vida NO EXISTA YA
        let estiloVidaId = estilosVida[estilosVida.length-1].id + 1;

        let estiloVida = {
            id: estiloVidaId,
            nombre: req.body.estiloVida_nombre,
            delete: false
        }

        console.log(req.body)
        console.log(req.file)
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