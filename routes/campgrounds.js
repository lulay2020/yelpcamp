let express = require('express'),
	router = express.Router(),
	Campground = require('../models/campgrounds'),
	middleware = require('../middleware');

router.get('/campgrounds', (req, res)=>{
	console.log(req.user)
	Campground.find({}, (err, campgrounds)=>{
		if (err) {
			console.log(err);
		}else{
			res.render('campgrounds/index', {campgrounds:campgrounds});
		}
	});
});
router.get('/campgrounds/new', middleware.isLoggedIn, (req, res)=>{
	res.render('campgrounds/new');
	
});

router.post('/campgrounds', middleware.isLoggedIn, (req, res)=>{
	let campground = {
		name : req.body.name,
		image : req.body.image,
		description : req.body.description,
		author : {
			id: req.user._id,
			username: req.user.username
	}};
	Campground.create(campground, (err, newCampground)=>{
		if (err) {
			req.flash('error', 'Oops! error occurred while creating a campground, please try again later.')
		}else{
			req.flash('success', 'You added a campground !');
			res.redirect('/campgrounds');
		}
	});	
});

router.get('/campgrounds/:id', (req, res)=>{
	Campground.findById(req.params.id).populate('comments').exec((err, campground)=>{
		if (err || !campground) {
			req.flash('error', 'No campground found');
			res.redirect('back');
		}else{
			res.render('campgrounds/show', {campground: campground});
		}
	});
});

router.get('/campgrounds/:id/edit', middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findById(req.params.id, (err, campground)=>{
		if (err || !campground) {
			req.flash('error', 'No campground found')
			res.redirect('back')
		}else{
			res.render('campgrounds/edit', {campground:campground})
		}
	});	
});

router.put('/campgrounds/:id/', middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground)=>{
		if (err || !campground) {
			req.flash('error', 'No campground found')
			res.redirect('/campgrounds')
		}else{
			req.flash('success', 'Successfully edited') 
			res.redirect('/campgrounds/'+req.params.id)
	}
	});
});

router.delete('/campgrounds/:id', middleware.checkCampgroundOwnership, (req, res, next)=>{
	Campground.findById(req.params.id, (err, campground)=>{
		if (err) {
			return next(err)
		}
		campground.remove();
		req.flash('success', 'Successfully deleted');
		res.redirect('/campgrounds');
	});
});

module.exports = router;