let express= require('express'),
	router = express.Router({mergeParams: true}),
	Campground = require('../models/campgrounds'),
	Comment = require('../models/comments'),
	middleware = require('../middleware');

router.get('/campgrounds/:id/comments/new', middleware.isLoggedIn, (req, res)=>{
	Campground.findById(req.params.id, (err, campground)=>{
		if (err || !campground) {
			req.flash('error', 'No campground found :(')
			res.redirect('back')
		}else{
			res.render('comments/new', {campground: campground});
		}
	});
});

router.post('/campgrounds/:id/comments', middleware.isLoggedIn, (req, res)=>{
	Campground.findById(req.params.id, (err, campground)=>{
		if (err || !campground) {
			req.flash('error', 'No campground found :(')
			return res.redirect('back')
		}
		Comment.create(req.body.comment, (err, comment)=>{
			if (err) {
				req.flash('error', 'Oops!, Error occurred while creating comment, please try again later.')
			}else{
				comment.author.id = req.user._id;
				comment.author.username = req.user.username;
				comment.save();
				campground.comments.push(comment);
				campground.save();
			}

		});
		res.redirect('/campgrounds/'+ req.params.id)
	});
});

// edit & update routes 
router.get('/campgrounds/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, (req, res)=>{
	Campground.findById(req.params.id, (err, campground)=>{
		if (err || !campground) {
			req.flash('error', 'No campground found')
			return res.redirect('back')	
		}
		Comment.findById(req.params.comment_id, (err, comment)=>{
			if (err) {
				res.redirect('back')
			}else{
				res.render('comments/edit', {campground_id: req.params.id, comment:comment})
			}
		});
	});
});

router.put('/campgrounds/:id/comments/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment)=>{
		if (err) {
			req.flash('error', 'Oops! error occured while updating comment')
			res.redirect('back')
		}else{
			req.flash('Successfully updated your comment')
			res.redirect('/campgrounds/'+ req.params.id)
		}
	})
})

router.delete('/campgrounds/:id/comments/:comment_id', middleware.checkCampgroundOwnership, (req, res)=>{
	Comment.findByIdAndDelete(req.params.comment_id, (err, campground)=>{
		if (err) {
			req.flash('error', 'No campground found to be deleted')
			res.redirect('back')
		}else{
			req.flash('success', 'Deleted successfully')
			res.redirect('/campgrounds/'+ req.params.id)
		}
	})
})

module.exports = router;
