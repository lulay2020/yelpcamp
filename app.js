let dotenv = require('dotenv').config(),
	express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	flash = require('connect-flash'),
	session = require("express-session"),
	MongoStore = require("connect-mongo")(session),
	passport = require('passport'),
	methodOverride = require('method-override'),
	localStrategy = require('passport-local'),
	Campground = require('./models/campgrounds'),
	Comment = require('./models/comments'),
	User = require('./models/users'),
	mongoose = require('mongoose'),
	seedDB = require('./seeds');

//requiring routes
let commentRoutes = require('./routes/comments'),
<<<<<<< HEAD
	campgroundRoutes = require('./routes/campgrounds'),
 	indexRoutes = require('./routes/index');

=======
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index');

//configure mongoDB
// let url = 'mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true}-
>>>>>>> aa84265cac0566c112b905fd2ee1cd79301eb543
mongoose.connect(process.env.DATABASEURL,
{useNewUrlParser: true,
 useCreateIndex: true,
 useUnifiedTopology: true
}).then(()=>{
	console.log('Connected to db');
}).catch(err =>{
	console.log('error', err.message)
})
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
<<<<<<< HEAD
=======

//configure express session for passport package
>>>>>>> aa84265cac0566c112b905fd2ee1cd79301eb543
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 } // 180 minutes session expiration
}));

<<<<<<< HEAD
app.locals.moment = require('moment');
=======
>>>>>>> aa84265cac0566c112b905fd2ee1cd79301eb543
//two lines to configure passport
app.use(passport.initialize());
app.use(passport.session());

//tell passport-local to use passport-local-mongoose methods
passport.use(new localStrategy(User.authenticate()))

//passport-local-mongoose methods to encode and decode data in the session
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//global middleware 
app.use((req, res, next)=>{
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

// seedDB();
let port = process.env.PORT || 3000;
app.listen(port, ()=>{
	console.log('yelp camp is listening !!!')
})
