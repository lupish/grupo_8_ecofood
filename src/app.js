const express=require('express');
const path=require('path')
const app=express();
const methodOverride = require("method-override");
<<<<<<< HEAD
const logMiddleware = require("../middlewares/logMiddleware.js");
const session=require("express-session")
=======
const session = require('express-session');
const cookieParser = require('cookie-parser');
const recordameMiddleware = require('./middlewares/recordameMiddleware');


>>>>>>> 3b01cd88369c783ea71884eb43fa9819113db8e7
app.use(express.static('public'));
app.use(session({secret:"Shh,es un secreto!"}));

console.log(app)

// set views
app.set('views', path.join(__dirname, './views'));

// set engine
app.set('view engine', 'ejs');



/*** MIDDLEWARES ***/
app.use(express.json());

//este metodo URLencoded permite recibir la informacion de un formulario enviado por post
app.use(express.urlencoded({ extended : false}));
app.use(methodOverride("_method"));
app.use(session({secret: "EcoFood secret"}));
app.use(cookieParser());
app.use(recordameMiddleware);

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

<<<<<<< HEAD
const aboutRouter = require('./routes/aboutUsRouter.js');
app.use('/aboutus', aboutRouter);

//ERROR 404
=======
const panelRouter = require('./routes/panelRouter');
app.use('/panels', panelRouter);

const brandRouter = require('./routes/brandRouter');
app.use('/brands', brandRouter);


>>>>>>> 3b01cd88369c783ea71884eb43fa9819113db8e7
// bd estilosVida
const fs = require('fs');
const estilosVidaJSON = path.join(__dirname,'./data/estilosVidaDB.json');
const estilosVida = JSON.parse(fs.readFileSync(estilosVidaJSON, 'utf-8'));


//ERROR 404
app.use((req, res, next) => {
   res.status(404).render('./products/product-not-found');
});