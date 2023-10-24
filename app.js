const createError = require('http-errors');
const dotenv = require('dotenv')
const express = require('express');
const app = express();
const passport = require('passport')
const session = require('express-session')
const {loginCheck} = require('./auth/passport')
loginCheck(passport)
const flash = require('connect-flash')

const connectDB = require('./model/connection/connection')
connectDB()


const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
app.use(session({
  secret:"oneboy",
  saveUninitialized:false,
  resave:false
}))


dotenv.config({path:'config.env'})
//const nocache = require('nocache')
const PORT = process.env.PORT || 4000;

app.use(flash())
app.use(passport.initialize());
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.message = req.flash('successMessage');
  res.locals.message = req.flash('errorMessage');
  res.locals.user = req.user;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// main router
const routes = require('./routes/adminRutes');
const userRoutes = require('./routes/userRoutes');
app.use('/admin',routes);
app.use('/brepublic',userRoutes)
// app.use(nocache());

app.listen(PORT,()=>{
  console.log(`server is running on http://localhost:${PORT}/admin/login`)
  console.log(`server is running on http://localhost:${PORT}/brepublic/landing`)
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
