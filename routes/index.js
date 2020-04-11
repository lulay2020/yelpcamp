let express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	User = require('../models/users')

router.get('/', (req, res)=>{
	res.render('landing');
})

//register routes
router.get('/register', (req, res)=>{
	res.render('register')
})

router.post('/register', (req, res)=>{
	let newUser = new User({username: req.body.username})
	User.register(newUser, req.body.password, (err, user)=>{
		if (err) {
			req.flash('error', err.message);
			res.redirect('/register');
		}else{
			passport.authenticate('local')(req, res, ()=>{
			req.flash('success', `Welcome to YelpCamp ${user.username} !`)
			res.redirect('/campgrounds')		
			})

		}
		
	})
})

//login routes
router.get('/login', (req, res)=>{
	res.render('login')
})

//app.post('/login', middleware, callbackfunction{}) ==> middleware call the passport local host method you defined up   
router.post('/login', passport.authenticate('local', 
	{
		successRedirect:'/campgrounds',
		failureRedirect:'/login'
	}), (res, req)=>{

})

// logout route
router.get('/logout', (req, res)=>{
	req.logout();
	req.flash('success', 'Successfully logged out')
	res.redirect('/campgrounds')
})

module.exports = router;


