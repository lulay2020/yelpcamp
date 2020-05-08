let express = require('express'),
	router = express.Router(),
	Campground = require('../models/campgrounds'),
	middleware = require('../middleware'),
	// configring multer
	multer = require('multer'),
	storage = multer.diskStorage({
		filename: (req, file, callback)=>{
			callback(null, Date.now() + file.originalname);
		}
	}),
	imageFilter = (req, file, cb)=>{
		if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
			return cb(new Error('only image files are allowed!'), false);
		}
		cb(null, true);
	},
	upload = multer({storage: storage, fileFilter: imageFilter});

let	cloudinary = require('cloudinary');
	cloudinary.config({
		cloud_name: 'ddpcvjr6j',
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET
	});

router.get('/campgrounds', (req, res)=>{
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

router.post('/campgrounds', middleware.isLoggedIn, upload.single('image'), (req, res)=>{
	cloudinary.v2.uploader.upload(req.file.path, (err, result)=>{
		if (err) {
			req.flash('error', err.message);
			return res.redirect('back');
		}
		req.body.campground.image = result.secure_url;
		req.body.campground.imageId = result.public_id;
		req.body.campground.author = {
			id: req.user._id,
			username: req.user.username
		}
		Campground.create(req.body.campground, (err, campground)=>{
		if (err) {
			req.flash('error', err.message);
			return res.redirect('back');
		}
			req.flash('success', 'You added a campground !');
			res.redirect('/campgrounds/' + campground.id);

		});
	})	
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

router.put('/campgrounds/:id/', upload.single('image'), middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findById(req.params.id, async function(err, campground){
		if (err || !campground) {
			req.flash('error', 'No campground found')
			res.redirect('/campgrounds')
		}else{
			if (req.file) {
				try{
					await cloudinary.v2.uploader.destroy(campground.imageId)
					let result = await cloudinary.v2.uploader.upload(req.file.path);
					campground.imageId = result.public_id;
					campground.image = result.secure_url;
				} catch(err){
					req.flash('error', err.message);
					return res.redirect('back');
				}
			}
			campground.name = req.body.name;
			campground.description = req.body.description;
			campground.save();
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
		campground.deleteOne();
		req.flash('success', 'Successfully deleted');
		res.redirect('/campgrounds');
	});
});

module.exports = router;