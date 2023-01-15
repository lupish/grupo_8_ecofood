const express=require('express');
const path=require('path')
const app=express();
const methodOverride = require("method-override");

app.use(express.static('public'));
console.log(app)

// set views
app.set('views', path.join(__dirname, './views'));

// set engine
app.set('view engine', 'ejs');

// POST
app.use(express.json());
app.use(express.urlencoded({ extended : false}));

//PUT
app.use(methodOverride("_method"));

app.listen(3000,()=>{console.log("Servidor Corriendo")})


/*** ROUTES ***/
const mainRouter = require('./routes/mainRouter');
app.use('/', mainRouter);

const userRouter = require('./routes/userRouter');
app.use('/users', userRouter);

const productRouter = require('./routes/productRouter');
app.use('/products', productRouter);