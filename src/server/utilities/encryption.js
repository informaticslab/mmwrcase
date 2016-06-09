////var bcrypt = require('bcrypt');
//
//exports.createSalt = function() {
//	return bcrypt.genSalt(10);
//}
//
//
//exports.hashPwd = function(pwd,salt) {
//	var hash = bcrypt.hashSync(pwd, salt);
//	return hash
//}


var crypto = require('crypto');

exports.createSalt = function() {
	return crypto.randomBytes(128).toString('base64');
}

exports.hashPwd = function(salt, pwd) {
	var hmac = crypto.createHmac('sha1', salt);
	return hmac.update(pwd).digest('hex');
}