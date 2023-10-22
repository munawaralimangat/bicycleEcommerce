const createError = require('http-errors');
const dotenv = require('dotenv')
const express = require('express');
const passport = require('passport')
const session = require('express-session')

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const {loginCheck} = require('./auth/passport')
loginCheck(passport)

dotenv.config({path:'config.env'})
//const nocache = require('nocache')
const PORT = process.env.PORT || 4000;
const app = express();

app.use(passport.initialize());
app.use(session({
  secret:"oneboy",
  saveUninitialized:false,
  resave:false
}))

const connectDB = require('./model/connection/connection')

connectDB()

// main router
const routes = require('./routes/routes');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//main route
app.use('/',routes);
// app.use(nocache());


app.listen(PORT,()=>{
  console.log(`server is running on http://localhost:${PORT}/admin/login`)
})



// // catch 404 and forward to error handler
// app.use((req, res, next) => {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error',{err});
// });
