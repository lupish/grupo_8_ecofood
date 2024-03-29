const express = require('express');

const app = express();
const methodOverride = require("method-override");


const session=require("express-session")

const cookieParser = require('cookie-parser');
const recordameMiddleware = require('./middlewares/recordameMiddleware');

const userLoggedMiddleware = require('./middlewares/userLogguedMiddleware')
const path = require('path');

app.use(express.static('public'));
app.use(session({secret:"Shh,es un secreto!"}));


// set views
app.set('views', path.join(__dirname, './views'));

// set engine
app.set('view engine', 'ejs');


/*** MIDDLEWARES ***/
app.use(express.json());
app.use(userLoggedMiddleware)



//este metodo URLencoded permite recibir la informacion de un formulario enviado por post
app.use(express.urlencoded({ extended : false}));
app.use(methodOverride("_method"));
app.use(session({
   secret: "EcoFood",
   resave: true,
   saveUninitialized: true
}));
app.use(cookieParser());
app.use(recordameMiddleware);

app.listen(3000,()=>{console.log("Servidor Corriendo")})


/*** ROUTES ***/
const mainRouter = require('./routes/mainRouter');
app.use('/', mainRouter, );

const userRouter = require('./routes/userRouter');
app.use('/users', userRouter);
const apiUserRouter = require('./routes/apiUserRouter');
app.use('/api/users', apiUserRouter);

const productRouter = require('./routes/productRouter');
app.use('/products', productRouter);
const apiProductRouter = require('./routes/apiProductRouter');
app.use('/api/products', apiProductRouter);

const panelRouter = require('./routes/panelRouter');
app.use('/panels', panelRouter);

const brandRouter = require('./routes/brandRouter');
app.use('/brands', brandRouter);

const lifeStylesRouter = require('./routes/lifeStylesRouter');
app.use('/lifeStyles', lifeStylesRouter);

const categoria = require('./routes/categoriasRouter');
app.use('/categoria', categoria);

//ERROR 404
app.use((req, res, next) => {
   res.status(404).render('./products/product-not-found');
});