const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true,
		unique: true
	},
	password: {
		type: String
	},
	permission: {
		type: String,
		enum: ['alumni', 'student'],
		default: 'student'
	},
	password: {
		type: String
	},
	slots_booked: {
		type: Number,
		default: 0
	}
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	const query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

module.exports.getAlumni = function(callback){
	const query = { permission:'alumni'};
	User.find(query, callback);
}

module.exports.findByUsernameAndUpdate = function(username, callback){
		console.log(username);
}
