//create new file named 'envProperties.js' with the correct local credentials for development


module.exports = {
	
	mysqlhost: '[mysql-host]',
	mysqluser: '[mysql-user]',
	mysqlpassword: '[mysql-password]',
	mysqldatabase: '[mysql-database]',
	ACCESS_LOG: './access_log.log',
	imagePath : './mmwrcowimg',
	USESSL : 'false',
  	SSL_CERT:  '/path/to/server-cert.pem',
  	SSL_KEY:  '/path/to/server-key.pem',
  	SSL_BUNDLE: '/path/to/gd_bundle-g2.crt'

};