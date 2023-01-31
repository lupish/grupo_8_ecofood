const express=require('express');
const path=require('path')
const app=express();
const methodOverride = require("method-override");
const logMiddleware = require("../middlewares/logMiddleware.js");
const session=require("express-session")
app.use(express.static('public'));
app.use(session({secret:"Shh,es un secreto!"}));

console.log(app)

// set views
app.set('views', path.join(__dirname, './views'));

// set engine
app.set('view engine', 'ejs');

// POST
app.use(express.json());

//este metodo URLencoded permite recibir la informacion de un formulario enviado por post
app.use(express.urlencoded({ extended : false}));

//PUT
app.use(methodOverride("_method"));

app.listen(3000,()=>{console.log("Servidor Corriendo")})
/** log middleware * */
app.use(logMiddleware)

/*** ROUTES ***/
const mainRouter = require('./routes/mainRouter');
app.use('/', mainRouter);

const userRouter = require('./routes/userRouter');
app.use('/users', userRouter);

const productRouter = require('./routes/productRouter');
app.use('/products', productRouter);

const aboutRouter = require('./routes/aboutUsRouter.js');
app.use('/aboutus', aboutRouter);

//ERROR 404
// bd estilosVida
const fs = require('fs');
const estilosVidaJSON = path.join(__dirname,'./data/estilosVidaDB.json');
const estilosVida = JSON.parse(fs.readFileSync(estilosVidaJSON, 'utf-8'));

app.use((req, res, next) => {
   res.status(404).render('./products/product-not-found');
});