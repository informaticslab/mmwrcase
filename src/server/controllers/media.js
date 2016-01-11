
var db = require('../lib/dbConnection');
var fs  = require('fs');
var config = require('../config/config');
var _ = require('lodash');


exports.uploadFile = function(req,res) {
	
	var modifiedPath = req.files.file.path;
	// var re = new RegExp('[\/][i][m][g]\s*([^\n\r]*)');
	modifiedPath = modifiedPath.substring(modifiedPath.indexOf('/img'));
	//console.log('modified path ' + modifiedPath);


	var uploadDoc = {};
	 	uploadDoc.case_id = req.body.case_id;
		uploadDoc.image_id = req.body.image_id;
		uploadDoc.sequence_id = req.body.sequence_id;
		uploadDoc.image_url = modifiedPath;
		uploadDoc.featured = req.body.featured;
		uploadDoc.title	= req.body.title;
		uploadDoc.caption = req.body.caption;
	res.send(uploadDoc);
};

exports.getFile = function(req,res) {
	var case_id = req.params.caseId;
	db.query('select * from image where case_id = ? order by sequence_id',[case_id],function(err,fileDoc){
		if (err) {
			res.send(err);
		}
		else {
	    	res.send(fileDoc);
		}
	});
};

exports.deleteFile = function(req,res) {
	var case_id = req.body.case_id;
	var image_url = req.body.image_url;
	//var filePath = config.rootPath+'/public/'+image_url;
	var filePath = image_url;
	if (case_id) { 
		db.query('delete from image where case_id = ? and image_url = ?',[case_id,image_url],function(err,result){
					if (err) {
						res.send(err);
						console.log(err);
					} else {
						fs.unlinkSync(filePath);
						res.send({
							success: true,
							result:result
						});
					}
			})
		}
	else { // case id not exist,  use the image url 

			db.query('delete from image where image_url = ?',[image_url],function(err,result){
					if (err) {
						res.send(err);
						console.log(err);
					} else {
						fs.unlinkSync(filePath);
						res.send({
							success: true,
							result:result
						});
					}
			})
		}
};

// exports.updateFileChecked = function(req,res) {
// 	var collection = mongo.mongodb.collection('uploads');
// 	//console.log(req.body);
// 	var files = req.body;

// 	for(var i = 0; i < files.length; i++) {

// 		var Id = req.body[i]._id;
// 		console.log(Id);
// 		collection.update({'_id':ObjectID(Id)}, { $set: {checked:req.body[i].checked}},function(err,result) {
// 			if(err) {
// 				res.send(err);
// 				console.log(err);
// 			} else {
// 				console.log("image checked updated", result);
// 				res.send({
// 					success: true,
// 					result: result
// 				});
// 			}

			
// 		});
// 	}
// }