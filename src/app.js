const express=require('express');
const path=require('path')
const app=express();
const methodOverride = require("method-override");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const recordameMiddleware = require('./middlewares/recordameMiddleware');

app.use(express.static('public'));
console.log(app)

// set views
app.set('views', path.join(__dirname, './views'));

// set engine
app.set('view engine', 'ejs');


/*** MIDDLEWARES ***/
app.use(express.json());
app.use(express.urlencoded({ extended : false}));
app.use(methodOverride("_method"));
app.use(session({secret: "EcoFood secret"}));
app.use(cookieParser());
app.use(recordameMiddleware);

app.listen(3000,()=>{console.log("Servidor Corriendo")})


/*** ROUTES ***/
const mainRouter = require('./routes/mainRouter');
app.use('/', mainRouter);

const userRouter = require('./routes/userRouter');
app.use('/users', userRouter);

const productRouter = require('./routes/productRouter');
app.use('/products', productRouter);

const panelRouter = require('./routes/panelRouter');
app.use('/panels', panelRouter);

const brandRouter = require('./routes/brandRouter');
app.use('/brands', brandRouter);

//ERROR 404
app.use((req, res, next) => {
   res.status(404).render('./products/product-not-found');
});