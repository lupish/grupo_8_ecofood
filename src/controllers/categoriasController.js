const path = require('path')
const fs = require('fs');

// bd marcas
const categoriasJSON = path.join(__dirname,'../data/categoriasDB.json');
const categoriasList = JSON.parse(fs.readFileSync(categoriasJSON, 'utf-8'));

const controller = {
    create: (req, res) => {
        res.render('categorias/create');
    },
    processCreate: (req, res) => {
        
        let categoriaId = categoriasList[categoriasList.length-1].id + 1;
       
        let categoria = {
            id: categoriaId,
            nombre: req.body.categoria_nombre,
            delete: false
           
        }

        console.log(req.body)
        console.log(req.file)
        if (req.file != undefined) {
            categoria.img = {
            nombre:"/img/categorias/" + req.file.filename,
            alt :req.file.originalname
        }
        } else {
            categoria.img = {
                nombre:"/img/categorias/" + req.file.filename,
                alt :req.file.originalname
            }
        }

        // Guardar estilo de vida en la bd
        categoriasList.push(categoria);
        console.log("*************************");
           fs.writeFileSync(categoriasJSON, JSON.stringify(categoriasList, null, 2))
           
           
       
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
    softDelete:(req,res)=>{
        let id = req.params.id;

        categoriasList.forEach(elem => {
            if (elem.id == id) {
                elem.delete=true;
            }
        });

        fs.writeFileSync(categoriasJSON, JSON.stringify(categoriasList, null, 2));

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