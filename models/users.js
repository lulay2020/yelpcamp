let mongoose = require('mongoose'),
	passportLocalMongoose = require('passport-local-mongoose');

let userSchema = new mongoose.Schema({
	username: String,
	password: String
})

//set passport-local-mongoose methods to our mongoose schema 
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema)