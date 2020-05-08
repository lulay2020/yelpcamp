let express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	User = require('../models/users'),
	campground = require('../models/campgrounds'),
	async = require('async'),
	nodemailer = require('nodemailer'),
	crypto = require('crypto');

router.get('/', (req, res)=>{
	res.render('landing');
})

//register routes
router.get('/register', (req, res)=>{
	res.render('register')
})

router.post('/register', (req, res)=>{
	let newUser = new User({username: req.body.username, email: req.body.email})
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

// forgot password
router.get('/forgot' , (req, res)=>{
	res.render('forgot');
});

router.post('/forgot', (req, res, next)=> {
    async.waterfall([
    	function(done) {
      		crypto.randomBytes(20, (err, buf)=> {
        		let token = buf.toString('hex');
        		done(err, token);
      		});
    	},
    	function(token, done) {
      		User.findOne({ email: req.body.email }, (err, user)=> {
        		if (!user) {
          			req.flash('error', 'No account with that email address exists.');
          			return res.redirect('/forgot');
        		}

        		user.resetPasswordToken = token;
        		user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        		user.save((err)=> {
          			done(err, token, user);
        		});
      		});
    	},
	    function(token, user, done) {
	      	let smtpTransport = nodemailer.createTransport({
		        service: 'Gmail', 
		        auth: {
		          	user: 'luluboo2020@gmail.com',
		          	pass: process.env.GMAILPW
		        }
	      	});
	        let mailOptions = {
	          	to: user.email,
	        	from: 'luluboo2020@gmail.com',
	        	subject: 'yelpCamp Password Reset',
	        	text: `You are receiving this because you (or someone else) have requested the reset of the password for your account
	          		Please click on the following link, or paste this into your browser to complete the process: 
	          		http://${req.headers.host}/reset/${token} 
	          		If you did not request this, please ignore this email and your password will remain unchanged.`
	      	};
      		smtpTransport.sendMail(mailOptions, (err)=> {
        	req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        	done(err, 'done');
      });
    }
], function(err) {
    	if (err) return next(err);
    	res.redirect('/forgot');
  	});
});

router.get('/reset/:token', (req, res)=> {
	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user)=> {
	    if (!user) {
	      	req.flash('error', 'Password reset token is invalid or has expired.');
	      	return res.redirect('/forgot');
	    }
	    res.render('reset', {token: req.params.token});
	});
});

router.post('/reset/:token', function(req, res) {
	async.waterfall([
	    function(done) {
	      	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user)=> {
	        	if (!user) {
	          		req.flash('error', 'Password reset token is invalid or has expired.');
	          		return res.redirect('back');
	        	}
	        	if(req.body.password === req.body.confirm) {
	        		user.setPassword(req.body.password, (err)=> {
	            		user.resetPasswordToken = undefined;
	            		user.resetPasswordExpires = undefined;

		            	user.save((err)=> {
		              		req.logIn(user, (err)=> {
		                		done(err, user);
		              		});
		            	});
	         		})
	        	} else {
	            	req.flash("error", "Passwords do not match.");
	            	return res.redirect('back');
	        	}
	    	});
	    },
	    function(user, done) {
		    let smtpTransport = nodemailer.createTransport({
		        service: 'Gmail', 
		        auth: {
		          	user: 'luluboo2020@gmail.com',
		          	pass: process.env.GMAILPW
		        }
		    });
		    let mailOptions = {
		        to: user.email,
		        from: 'luluboo2020@gmail.com',
		        subject: 'Your password has been changed',
		        text: `Hello there,
		          This is a confirmation that the password for your account ${user.email} has just been changed.`
		    };
		    smtpTransport.sendMail(mailOptions, (err)=> {
		        req.flash('success', 'Successfully! Your password has been changed.');
		        done(err);
		    });
		}],
		function(err) {
		   	res.redirect('/campgrounds');
		});
});

module.exports = router;


