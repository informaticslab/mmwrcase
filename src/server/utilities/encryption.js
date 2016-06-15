var bcrypt = require('bcrypt');

exports.createSalt = function() {
	//return bcrypt.genSalt(10);
	return bcrypt.genSaltSync(10);
}


exports.hashPwd = function(password,salt) {
	var hash = bcrypt.hashSync(password,salt);
	return hash
}


//var crypto = require('crypto');
//
//exports.createSalt = function() {
//	return crypto.randomBytes(128).toString('base64');
//}
//
//exports.hashPwd = function(salt, pwd) {
//	var hmac = crypto.createHmac('sha1', salt);
//	return hmac.update(pwd).digest('hex');
//}