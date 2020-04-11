let Comment = require('../models/comments')
let Campground = require('../models/campgrounds')
let middlewareObj = {}

middlewareObj.checkCampgroundOwnership= (req, res, next)=>{
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, campground)=>{
			if (err || !campground) {
				req.flash('error', 'Campground is not found')
				res.redirect('back')
			}else{
				if (campground.author.id.equals(req.user._id)) {
					next();
				}else{
					req.flash('error', 'You do not have permission to do that')
					res.redirect('back')
				}
			}
		})
	}else{
		res.redirect('back')
	}
}

middlewareObj.checkCommentOwnership = (req, res, next)=>{
		Comment.findById(req.params.comment_id, (err, comment)=>{
			if (err || !comment) {
				req.flash('error', err.message)
				res.redirect('back')
			}else{
				if (comment.author.id.equals(req.user._id)) {
					next();
				}else{
					req.flash('error', 'You do not have permission to do that')
					res.redirect('back')
				}
			}
		})
	}

middlewareObj.isLoggedIn = (req, res, next)=>{
	if (req.isAuthenticated()) {
		next();
	} else {
		req.flash('error', 'You have to be logged in')
		res.redirect('/login')
	}
}

module.exports = middlewareObj