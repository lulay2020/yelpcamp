let mongoose = require('mongoose'),
	passportLocalMongoose = require('passport-local-mongoose');

let userSchema = new mongoose.Schema({
	username: {type: String, unique: true, required: true},
	password: String,
	email: {type: String, unique: true, required: true},
	resetPasswordToken: String,
	resetPasswordExpires: Date
})

//set passport-local-mongoose methods to our mongoose schema 
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema)