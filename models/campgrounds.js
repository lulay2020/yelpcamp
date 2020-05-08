const	mongoose = require('mongoose'),
		Comment = require('./comments');

const	campgroundSchema = new mongoose.Schema({ 
		name: String, 
		image: String, 
		imageId: String,
		location: String,
		lat: Number,
		lng: Number, 
		description: String,
		createdAt: {type: Date, default: Date.now},
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Comment'
			}
		],
		author: {
			id:{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User'
			},
			username: String
		}

});

	campgroundSchema.pre('remove', async function(next) {
		try{
			await Comment.remove({
			'_id': {
				$in: this.comments
			}
		});
		next();
	}catch(err) {
		next(err);
	}
});


module.exports = mongoose.model('Campground', campgroundSchema);
