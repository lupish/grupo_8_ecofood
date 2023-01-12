let productController = {
    "newProduct" : function(req, res) {
        res.render("newProduct")
    },
    create : function(req, res){
       let producto = {
         name: req.body.name,
         description: req.body.description,
         image: req.body.image,
         category: req.body.category,
         price: req.body.price
       }

       res.redirect("/home.ejs")
    }
}