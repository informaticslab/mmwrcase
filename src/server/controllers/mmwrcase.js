encrypt = require('../utilities/encryption');
var db = require('../lib/dbConnection');


exports.getCasesByStatus = function(req,res) {
	//connection.connect();
	var devStatus = req.params.devStatus;
	var displayStatus = req.params.displayStatus; 
	//var sqlStm = 'SELECT * FROM case_main where development_status = ? and display_status = ?',[devStatus,displayStatus];
	//console.log(sqlStm)
	if(true){
		db.query('SELECT a.*,(rating_1 + rating_2+ rating_3 + rating_4 + rating_5) as rated_count FROM case_main a, rating b where development_status = ? and display_status = ? and a.case_id = b.case_id',[devStatus,displayStatus],function(err,rows){
  		if(err) {
  			res.send(err);
  		} 
  		else {

  		 	   res.send(rows);
 		 	}
		});
	}
	else
	{
		console.log("DB connection failed");
	}
//	connection.end();

}


exports.getCurrentCase = function(req,res) {
	//connection.connect();
	var caseData = {}
	if(true){
		db.query('SELECT a.*,(rating_1 + rating_2+ rating_3 + rating_4 + rating_5) as rated_count FROM case_main a, rating b where development_status = 5 and display_status = 0 and a.case_id = b.case_id',function(err,rows){
  		if(err) {
  			res.send(err);
  		} 
  		else {
  				try {
	  				caseData = rows[0];
	  				var caseId = caseData.case_id;
	  			//	sqlStm = 'SELECT * FROM image where case_id = ?'+ caseData.case_id;
	  			   	db.query('SELECT * FROM image where case_id = ?; select * from question where case_id = ?; select * from answer where case_id = ? ',[caseId,caseId,caseId],function(err,resultSets){
		  			   	if(err) {
		  					res.send(err);
		  				} 
		  				else {
		  					try {	//console.log('resultset ', resultSets);
					  				caseData['images'] = resultSets[0,0];
					  				caseData['QA'] = [];
					  				var questions = resultSets[0,1];
					  				var answers = resultSets[0,2];
					  			//	console.log('questions ',questions);
					  				for(var i = 0; i < questions.length; i ++){
					  				//	console.log(questions[i]);
					  					var oneQA = {'question': questions[i],'answers':[]};
					  					for (j=0; j < answers.length; j++){
					  						if (answers[j].question_id == questions[i].question_id) {
					  							delete answers[j].case_id;
					  							delete answers[j].question_id;
					  							oneQA.answers.push(answers[j])
					  						}
					  					}
					  					caseData['QA'].push(oneQA);
					  				}
					  				//casData['QA'] = 
					  				res.send(caseData);
	 		 					}
				 		 		catch(e) {
				 		 			res.send('case not found or problem with query');
				 		 		}
		  				}
  		 			});		
 		 		}
 		 		catch(e1){
 		 			res.send('case not found or problem with query');
 		 		}
 		 	}
		});
	}
	else
	{
		console.log("DB connection failed");
	}
//	connection.end();

}


exports.getUpComingCases = function(req,res) {
	//connection.connect();
	if(true){
		db.query('SELECT case_id, case_overview FROM case_main where development_status = 5 and display_status = 1',function(err,rows){
  		if(err) {
  			res.send(err);
  		} 
  		else {
  		 	   res.send(rows);
		 	}
		});
	}
	else
	{
		console.log("DB connection failed");
	}
//	connection.end();

}

exports.getPreviousCases = function(req,res) {
//	connection.connect();
	if(true){
		db.query('SELECT * FROM case_main where development_status = 5 and display_status = 2',function(err,rows){
  		if(err) {
  			res.send(err);
  		} 
  		else {
  		 	   res.send(rows);
		 	}
		});
	}
	else
	{
		console.log("DB connection failed");
	}
//	connection.end();

}

exports.getDraftCases = function(req,res) {
	db.query('select * from case_main where development_status <> 5', function(err,rows){
		if(err) {
  			res.send(err);
  		} 
  		else {
  		 	   res.send(rows);
		 	}
	})
}

exports.getQuestions = function(req,res) {
//	connection.connect();
	var caseId = req.params.caseId;
	//sqlStm = 'SELECT * FROM question where case_id = '+ caseId + ' order by sequence_id';
	if(true){
		db.query( 'SELECT * FROM question where case_id = ?',[caseId],function(err,rows){
  		if(err) {
  			res.send(err);
  		} 
  		else {
  		 	   res.send(rows);
		 	}
		});
	}
	else
	{
		console.log("DB connection failed");
	}
//	connection.end();

}
exports.getAnswers = function(req,res) {
//	connection.connect();
	var caseId = req.params.caseId;
	var questionId = req.params.questionId;
		db.query('SELECT * FROM answers where case_id = ? and question_id = ? '[caseId,questionId],function(err,rows){
  		if(err) {
  			res.send(err);
  		} 
  		else {
  		 	   res.send(rows);
		 	}
		});
//	connection.end();

}


exports.getCaseById = function(req,res) {
	var caseId = req.params.caseId;
	var caseData = {}
		db.query('select * from case_main where case_id = ?; SELECT * FROM image where case_id = ?; select * from question where case_id = ?; select * from answer where case_id = ? ',[caseId,caseId,caseId,caseId],function(err,resultSets){
		if(err) {
  			res.send(err);
  		} 
  		else { 
  				//console.log(resultSets);
	  			if (resultSets[0,0].length > 0) {
	  				caseData = resultSets[0,0][0];
	  				caseData['images'] = resultSets[0,1];
	  				caseData['QA'] = [];
	  				var questions = resultSets[0,2];
	  				var answers = resultSets[0,3];
	  			//	console.log('questions ',questions);
	  				for(var i = 0; i < questions.length; i ++){
	  				//	console.log(questions[i]);
	  					var oneQA = {'question': questions[i],'answers':[]};
	  					for (j=0; j < answers.length; j++){
	  						if (answers[j].question_id == questions[i].question_id) {
	  							delete answers[j].case_id;
	  							delete answers[j].question_id;
	  							oneQA.answers.push(answers[j])
	  						}
	  					}
	  					caseData['QA'].push(oneQA);
	  				}
	  				//casData['QA'] = 
	  				res.send(caseData);
  				}
  				else {
  					res.send({error:'case not found'})
  				}
	  	 	}
		});
}

exports.getAllAvailCases = function(req,res) {
	//connection.connect();
	var devStatus = req.params.devStatus;
	var displayStatus = req.params.displayStatus; 
	//var sqlStm = 'SELECT * FROM case_main where development_status = ? and display_status = ?',[devStatus,displayStatus];
	//console.log(sqlStm)
	if(true){
		db.query('SELECT * FROM case_main where development_status = ? and display_status <> ?',[5,3],function(err,rows){
  		if(err) {
  			res.send(err);
  		} 
  		else {

  		 	   res.send(rows);
 		 	}
		});
	}
	else
	{
		console.log("DB connection failed");
	}
//	connection.end();

}

exports.updateHitCounter = function(req,res) {
	var caseId = req.params.caseId;
	var questionId = req.params.questionId;
	var answerId = req.params.answerId;
	db.query('update answer set hit_counter = hit_counter+1 where case_id = ? and question_id=? and answer_id = ?',[caseId,questionId,answerId],function(err,result) {
		if (err) {
			res.send(err);
		}
		else {
			res.send('update success');
		}
	})

}

exports.createCase = function(req,res) {
	var caseData = req.body;
	var case_id = caseData.case_id;
	var currentId= caseData.replaceCurrent;
	delete caseData.replaceCurrent;
	// test data
//	caseData = 
// 	{   
//     "title": "Hepatitis C", 
//     "overview": "A 28yo Asian woman presents to arrange ongoing car… normal based on standard, non-invasive measures.", 
//     "publication_date": null,
//     "case_text": "A 28yo Asian woman presents to arrange ongoing care for her new baby following delivery. She is in her 37th week of what has been a completely uneventful, normal, first pregnancy. She has had excellent prenatal care and fetal development has been normal based on standard, non-invasive measures. ",
//     "abstract_text": "The current recommendations from the Advisory Committee on Immunization Practices (ACIP) for infants born to hepatitis B-infected mothers include postexposure prophylaxis consisting of hepatitis B (HepB) vaccine and hepatitis B immune globulin administered within 12 hours of birth, followed by completion of the 3- or 4-dose HepB vaccine series (1). To identify infants who need revaccination as well as those who need follow-up medical care for hepatitis B virus (HBV) infection, ACIP currently recommends HepB post-vaccination serologic testing (PVST) at age 9–18 months (1). This report provides CDC guidance for shortening the interval for PVST to age 9–12 months to reduce the need for unnecessary revaccination and was prompted by new data from the Enhanced Perinatal Hepatitis B Prevention Program (EPHBPP).",
//     "additional_information": "",
//     "rating": null,
//     "development_status": 0,
//     "development_status_notes": "",
//     "display_status": 0,
//     "available_cme_credits": 1,
//     "cme_release_date": null,
//     "cme_valid_until": null,
//     "number_cme_credits_available": 3,
//     "tag_line": null
// }
	db.query('insert into case_main set ?',caseData,function(err,result){
			if(err) {
	        	res.send(err);
  			} 
  			else {
  			 	// create a rating record for this case
  			 	var rating_record = {
  			 		'case_id' : case_id
  			 	}
  			 	db.query('insert into rating set ? ',[rating_record],function(err,ratingResult){
  			 		if (err) {
  			 			res.send(err);
  			 		}
  			 		else {
  			 			if (currentId) {
  			 				db.query('update case_main set display_status = 2 where case_id = ?'[currentId],function(err,updatedResult){
  			 					if (err) {
  			 						res.send(err);
  			 					}
  			 					else {
  			 					 	res.send({'message':'new case added and curent case moved to archived','caseId': result.insertId});
  			 					}
  			 				})
  			 			}
  			 			else 
  			 			{
  			 				 res.send({'message':'case added','caseId': result.insertId});
  			 			}
  			 		}
  			 	})
  			  
 		 	}
	})

}

exports.updateCase = function(req,res) {
	var caseData = req.body;
	var QA = caseData.QA;
	var images = caseData.images;
	var currentId = caseData.replaceCurrent;
	delete caseData.QA;
	delete caseData.images;
	delete caseData.replaceCurrent;

		// test data
//	caseData = 
// 	{  "case_id": 5, 
//     "title": "Hepatitis C", 
//     "overview": "A 30yo Asian woman presents to arrange ongoing car… normal based on standard, non-invasive measures.", 
//     "publication_date": null,
//     "case_text": "A 28yo Asian woman presents to arrange ongoing care for her new baby following delivery. She is in her 37th week of what has been a completely uneventful, normal, first pregnancy. She has had excellent prenatal care and fetal development has been normal based on standard, non-invasive measures. ",
//     "abstract_text": "The current recommendations from the Advisory Committee on Immunization Practices (ACIP) for infants born to hepatitis B-infected mothers include postexposure prophylaxis consisting of hepatitis B (HepB) vaccine and hepatitis B immune globulin administered within 12 hours of birth, followed by completion of the 3- or 4-dose HepB vaccine series (1). To identify infants who need revaccination as well as those who need follow-up medical care for hepatitis B virus (HBV) infection, ACIP currently recommends HepB post-vaccination serologic testing (PVST) at age 9–18 months (1). This report provides CDC guidance for shortening the interval for PVST to age 9–12 months to reduce the need for unnecessary revaccination and was prompted by new data from the Enhanced Perinatal Hepatitis B Prevention Program (EPHBPP).",
//     "additional_information": "",
//     "rating": null,
//     "development_status": 0,
//     "development_status_notes": "",
//     "display_status": 0,
//     "available_cme_credits": 1,
//     "cme_release_date": null,
//     "cme_valid_until": null,
//     "number_cme_credits_available": 3,
//     "tag_line": null
// }
	var case_id = caseData.case_id;
//	console.log('case_id ',case_id, 'case data: ', caseData);
	// setup a transaction to make sure that all db operation completed with no error
	db.beginTransaction(function(err) {
	  if (err) { throw err; }
	  db.query('update case_main set ? where case_id = ?',[caseData,case_id],function(err,updateResult){
	    if (err) {
	    	throw err;
	      	return db.rollback(function() {
	        
	      });
	    }
		//	createQuestionAnswer(QA);
			if (currentId) {
  			 				db.query('update case_main set display_status = 2 where case_id = ?',[currentId],function(err,updatedResult){
  			 					if (err) {
  			 						res.send(err);
  			 					}
  			 					else {
  			 						res.send({'success':true});
  			 					}
  			 				})
  			 			}
			 else { 
			 	res.send({'success':true});
			 }
			// remove all question and answer before re-insert with the new order (if changed)
			// db.query('delete from question where case_id = ? ; delete from answer where case_id = ?',[case_id,case_id],function(err,qDeleteResult){
			// 	if (err) {
			// 		return connection.rollback(function() {
			// 			throw err;
			// 		});
			// 	}
			// 	db.query('update question set ? where case_id = ? and question_id = ?',[case_id,question_id],function(err,updateResult){
		 //    		if (err) {
			//         	return connection.rollback(function() {
			//           		throw err;
			//         	});
			//         }
			//         connection.commit(function(err) {
			// 	        if (err) {
			// 	          return connection.rollback(function() {
			// 	            throw err;
			// 	          });
		 //        		}
		 //        		console.log('success!');	
		 //      		})
			// 	});
	  //     	});
	    });
	  });

}

exports.deleteCase = function(req,res) {

	var caseId = req.params.caseId;
	db.query('call delete_case(?)',[caseId], function(err, result) {
	    if (err) {
	    		res.send(err);
	    }
	    else {
	       res.send("delete success");
	     }
	});
}

exports.createQuestion = function(req,res) {
	var data = req.body;
	db.query('insert into question set ? ',data,function(err,result){
		if(err) {
  			res.send(err);
  		} 
  		else {
  			   res.send({'message':'question added','question_id': result.insertId});
 		 	}
	})
}

exports.updateQuestion = function(req,res) {
	var data = req.body;
	var case_id = data.case_id;
	var question_id = data.question_id;

	db.query('update question set ? where case_id = ? and question_id = ?',[case_id,question_id],function(err,updateResult){
		if (err) {
			res.send(err);
		}
		else {
			res.send('Question Update success');
		}
	})
}

exports.createLogin = function(req,res) {
	var userData = req.body;
	userData.display_name = userData.first_name + " " + userData.last_name;
	if (userData.user_name == '' || userData.user_name == null){
		// blank user name,  set default to first part of email address
		var emailParts = userData.email.split('@');
		userData.user_name = emailParts[0];
	}
	userData.salt = encrypt.createSalt();
	userData.hash_password  = encrypt.hashPwd(userData.password,userData.salt);
	//userData.hash_password = userData.password;
	userData.last_login = null;
	userData.enabled = 0;
	userData.token = null;
	userData.type = 'user';
	//userData.med_school = null;
	delete userData.password;  // remove un-needed field
	db.query('insert into user set ?',[userData],function(err,insertResult){
		if (err) {
			console.log(err);
			res.send(err);
		}
		else {
			res.send({'success':true});
		}
	})
}


function updateQuestion(question) {
	var case_id = question.case_id;
	var question_id = question.question_id;

	db.query('update question set ? where case_id = ? and question_id = ?',[case_id,question_id],function(err,updateResult){
		if (err) {
			return err;
		}
		else {
			return {'success':true}
		}
	})
}

exports.createAnswer = function(req,res) {
	var data = req.body;
	db.query('insert into answer set ?',data,function(err,result){
		if(err) {
  			res.send(err);
  		} 
  		else {
  			   res.send('answer added');
 		 	}
	})
}

exports.updateAnswer = function(req,res) {
	var data = req.body;
	var case_id = data.case_id;
	var question_id = data.question_id;
	var answer_id = data.answer_id;

	db.query('update answer set ? where case_id = ? and question_id = ? and answer_id = ?',[case_id,question_id,answer_id],function(err,updateResult){
		if (err) {
			res.send(err);
		}
		else {
			res.send('Answer Update success');
		}
	})
}

exports.checkUserNameExist = function(req,res) {
	var user_name = req.params.user_name;
	db.query('select 1 from mmwr_case.user where user_name = ?',[user_name],function(err,result){
		if (err) {
			console.log(err);
			res.send(err);
		}
		else {
			if (result.length > 0) {
				res.send(true);
			}
			else {
				res.send(false);
			}
		}

	})
};

exports.checkEmailExist = function(req,res) {
	var email = req.params.email;
	db.query('select 1 from mmwr_case.user where email = ?',[email],function(err,result){
		if (err) {
			console.log(err);
			res.send(err);
		}
		else {
			if (result.length > 0) {
				res.send(true);
			}
			else {
				res.send(false);
			}
		}

	})
};

function updateAnswer(answer) {
	var data = answer;
	var case_id = data.case_id;
	var question_id = data.question_id;
	var answer_id = data.answer_id;

	db.query('update answer set ? where case_id = ? and question_id = ? and answer_id = ?',[case_id,question_id,answer_id],function(err,updateResult){
		if (err) {
			return err;
		}
		else {
			return {'success':true};
		}
	})
}

exports.createQuestionAnswer= function(req,res) {


	var allQA = req.body;
// test data
// 	{   
//     "question": {"question_id":1,"case_id":5,"sequence_id":1,"post_pre":"pre","question":"this is question 1"} ,
//     "answers": [
//                 {"answer_id":1,"question_id":1,"case_id":5,"answer":"answer 1","correct":0,"hit_counter":0}
//                 ,{  "answer_id":2,"question_id":1,"case_id":5,"answer":"answer 2","correct":0,"hit_counter":0}
//                 ,{  "answer_id":3,"question_id":1,"case_id":5,"answer":"answer 3","correct":1,"hit_counter":0}
//                 ,{  "answer_id":4,"question_id":1,"case_id":5,"answer":"answer 4","correct":0,"hit_counter":0}
//     ]
// }
	// var case_id = data.case_id;
	 var questions = [];
	 var answers = [];
	 for (var i=0; i < allQA.length; i++) { // iterate and build the sql data values for insert
	 	questions.push(allQA[i].question);
	 	for (var j = 0; j < allQA[i].answers.length; j++) {
	 		answers.push(allQA[i].answers[j]);
	 	}
	 	
	 }
	 if (questions.length > 0) {
	 	//console.log(answers);
	 	
	 	var case_id = questions[0].case_id;
	 	db.beginTransaction(function(err) {
	  	if (err) { throw err; }
	  	// remove all existing questions and answers and replace with the ones from the page (if the order changed)
	  		db.query('delete from answer where case_id = ?; delete from question where case_id = ? ;' ,[case_id,case_id], function(err,deleteResult){
	  			if (err) {
	  					return db.rollback(function() {
	  					throw err;
	  				})
	  				
	  			}
	  		var questionValueSet = reformatForMySQL(questions);
	  		var sqlStr = 'insert into question (' + questionValueSet.colNames.join(',') + ') VALUES ' + questionValueSet.valueSet.join(',');
	   		db.query(sqlStr,function(err,questionResult){
		   		if (err) {
		   			  	return db.rollback(function() {
	        			throw err;
	      				});
		   				res.send({'error location':'question','error msg':err});
		   		}
		   		else {
		   				var answerValueSet = reformatForMySQL(answers);
						var sqlStr = 'insert into answer (' + answerValueSet.colNames.join(',') + ') VALUES ' + answerValueSet.valueSet.join(',');
						db.query(sqlStr, function(err, rows, fields) {
			   				if (err) {
			   					 return db.rollback(function() {
						          throw err;
						        });
			   				}
			   				else {
									db.commit(function(err) {
							        if (err) {
							          return db.rollback(function() {
							            throw err;
							          });
							        }
							        res.send({'success':true});
							      });
							}		
			   			});
		   			}
  		   		});	
	  		});
	  		
	   	});
	}
}

exports.checkQuestionExist = function(req,res) {
	var case_id = req.params.caseId;
	var question_id = req.params.questionId;

	db.query('SELECT 1 FROM question WHERE case_id =  ? AND question_id = ?',[case_id,question_id],function(err,result){
			if (err) {
				res.send(err);
			}
			else {
				if (result.length > 0) {
					res.send(true);
				}
				else {
					res.send(false);
				}
			}
	})
}

exports.checkAnswerExist = function(req,res) {
		var case_id = req.params.caseId;
	var question_id = req.params.questionId;
	var answer_id = req.params.answerId;

	db.query('SELECT 1 FROM answer WHERE case_id =  ? AND question_id = ? and answer_id = ?',[case_id,question_id,answer_id],function(err,result){
			if (err) {
				res.send(err);
			}
			else {
				if (result.length > 0) {
					res.send(true);
				}
				else {
					res.send(false);
				}
			}
	})

}
exports.checkCaseExist = function(req,res) {
		var case_id = req.params.caseId;

	db.query('SELECT 1 FROM case_main WHERE case_id =  ?',[case_id],function(err,result){
			if (err) {
				res.send(err);
			}
			else {
				if (result.length > 0) {
					res.send(true);
				}
				else {
					res.send(false);
				}
			}
	})
}

exports.getRating = function(req,res) {
  	var case_id = req.params.caseId;
  	console.log('back ',case_id);
  	db.query('select case_id, ROUND(((rating_1 + rating_2+ rating_3 + rating_4 + rating_5) / 5),0)  as rated, (rating_1 + rating_2+ rating_3 + rating_4 + rating_5) as rated_count from rating where case_id = ?',[case_id],function(err,result){
  		if (err) {
				res.send(err);
		}
		else {
			 	res.send(result);
		}
  	});
}

exports.updateRating = function(req,res) {
	var data = req.body;
	var case_id = data.caseId;
	var rating =  data.rating;
	var user_id  = data.user_id;
	var  rateColumn = 'rating_'+ rating;
	var sqlStr = 'update rating set '+ rateColumn + ' = IFNULL(' + rateColumn + ',0) + 1 where case_id = ' + case_id;
	db.query(sqlStr,function(err,result){
		if (err) {
				res.send(err);
		}
		else {	
			db.query('select case_id, ROUND((rating_1 + (rating_2*2)+ (rating_3*3) + (rating_4*4) + (rating_5*5)) / (rating_1 + rating_2+ rating_3 + rating_4 + rating_5),0)  as rated from rating where case_ID = ?',[case_id],function(err,result){
		  		if (err) {
						res.send(err);
				}
				else {
					// update rating to case_main  
							db.query('update case_main set rating = ? where case_id = ?',[result[0].rated,case_id],function(err,updateResult){
							if (err) {
								res.send(err);
							}
							else {

								res.send('rating added');
							}
						});
					// update rating to user history
						if (user_id) {
							db.query('update user_history set rated = ? where user_id = ? and case_id = ?',[rating,user_id,case_id],function(err,result){
								if (err) {
									console.log('user history rating update error: ',err);
									res.send(err);
								}
								else {
									res.send('user history rating updated');
								}
							})
						}
						
					}
		  	});

			 	
		}
	});
}

exports.getAnswerStatistic = function(req, res) {
	var case_id = req.params.caseId;
	var question_id = req.params.questionId;

	db.query('select *, hit_counter / (select sum(hit_counter) from answer where case_id = ? and question_id = ?)*100  as distribution from answer where case_ID = ? AND question_id = ? ',[case_id,question_id,case_id,question_id], function(err,result){
		if (err) {
			res.send(err);
		}
		else {
			res.send(result);
		}
	})

}

exports.getDevStatus = function(req,res) {

	db.query('select * from development_status', function(err,result){
		if (err) {
			res.send(err);
		}
		else {
			res.send(result);
		}
	})
}

exports.getDisplayStatus = function(req,res) {

	db.query('select * from display_status where display_status_id < 3', function(err,result){
		if (err) {
			res.send(err);
		}
		else {
			res.send(result);
		}
	})
}

exports.getTopRatedCases = function(req,res) {
	var numberToGet = req.params.numberToGet; 
	//var sqlStr =  'select case_id, title, publication_date, tag_line, rating from case_main order by rating DESC limit ' + numberToGet
	var sqlStr =  'select a.case_id, title, publication_date, tag_line, a.rating ,(rating_1 + rating_2+ rating_3 + rating_4 + rating_5) as rated_count from case_main a,rating b where a.case_id = b.case_id and (a.display_status = 2) and a.rating > 2 order by rating DESC limit '+ numberToGet
	db.query(sqlStr, function(err,result){
		if (err) {
		res.send(err);
		}
		else {

		res.send(result);
		}
	})
}
exports.getSortOptions = function(req,res) {
	db.query('select * from case_sorting_options',function(err,result){
		if (err) {
		res.send(err);
		}
		else {
		res.send(result);
		}
	})
}
exports.getCaseRatingStats = function(req,res) {
//	console.log('api hit');
	db.query('SELECT concat("Cases with rating ",rating) as "name", COUNT(*) AS "y" FROM case_main where display_status <> 3 and development_status = 5 GROUP BY name', function(err, result){
		if (err) {
		res.send(err);
		}
		else {
		res.send(result);
		}
	})
}

exports.testReformatted = function(req,res) {
	var data = req.body;
	console.log(data);
	var reformatted = reformatForMySQL(data);
	res.send(reformatted);
}

exports.getNextCaseId = function(req,res) {
	db.query('UPDATE master_controls SET next_case_id = LAST_INSERT_ID(next_case_id + 1) where next_case_id >= 0;',function(err,result){
		if (err) {
			res.send(err);
		}
		else {
			res.send(result);
		}
	})
}

exports.saveImages = function(req,res) {
	var images = req.body;
	console.log('images ',images)
	var case_id = images[0].case_id;
	 	db.beginTransaction(function(err) {
	  	if (err) { throw err; }
	  	// remove all existing images and replace with the ones from the page (if the order changed)
	  		db.query('delete from image where case_id = ?',[case_id], function(err,deleteResult){
	  			if (err) {
	  					return db.rollback(function() {
	  					throw err;
	  				})
	  				
	  			}
	  		var imageValueSet = reformatForMySQL(images);
	  		var sqlStr = 'insert into image (' + imageValueSet.colNames.join(',') + ') VALUES ' + imageValueSet.valueSet.join(',');
	   		db.query(sqlStr,function(err,questionResult){
		   		if (err) {
		   			  	return db.rollback(function() {
	        			throw err;
	      				});
		   				res.send({'error location':'images','error msg':err});
		   		}
		   		else {
		   				res.send({'success':true});			
		   			}
  		   		});	
	  		});
	  		
	   	});
}

exports.getMasterData = function(req,res) {
	var masterData = require('../data/masterData.json');
	db.query('select * from mmwr_case.schools',function(err,result){
		if (err) {
			console.log('error from get masterdata ', err);
			res.send({'error': err});
		}
		else {
			masterData.medicalSchools = result;
			res.send(masterData);
		}
	})


};

exports.saveResult = function(req,res) {
	var data = req.body;
	db.query('insert into user_history set ?',[data], function(err,result){
		if (err) {
			 res.send(err);
		}
		else {
			res.send({'success':'result saved'});
		}
	})
};

exports.getUserHistory = function(req,res) {
	var user_id = req.params.userId;
	db.query('select user_id,a.case_id,title,date_completed,result,rated from user_history a left join case_main b on a.case_id = b.case_id where user_id = ? ',[user_id],function(err,result){
		if (err) {
			console.log(err);
			res.send({'error':err});
		}
		else {
			res.send(result);
		}
	})
};

exports.updateUserHistory = function(req,res) {
	var user_id = req.body.user_id;
	var case_id = req.body.case_id;
	delete req.body.user_id;
	delete req.body.case_id;

	db.query('update mmwr_case.user_history set ? where user_id = ? and case_id = ?',[req.body,user_id,case_id],function(err,result){
		if (err) {
			console.log(err);
			res.send({'error':err});
		}
		else {
			console.log(result);
			if (result.changedRows > 0) {
				res.send({'success':'User History updated'});
			}
			else {
				res.send({'success':'nothing changed'});
			}
		}
	})
};

exports.getTopLeaders = function(req,res) {
	var limitCount = req.params.limit;
	db.query('select b.user_name,a.user_id,count(1) as case_taken, sum(result = 1) as correct, sum(result = 1) / count(1) * 100 as correct_percent from mmwr_case.user_history as a left join mmwr_case.user as b on a.user_id = b.user_id  group by user_id order by correct_percent desc limit '+ limitCount,[],function(err,result){
		if (err) {
			res.send({'error':err});
		}
		else {
			res.send(result);
		}
	})
};

exports.getTopOrganizations = function(req, res) {
	var limitCount = req.params.limit;
	db.query('select b.med_school as organization,count(1) as case_taken, sum(result = 1) as correct, sum(result = 1) / count(1) * 100 as correct_percent from mmwr_case.user_history as a left join mmwr_case.user as b on a.user_id = b.user_id where leaderboard_opt_school = "1" group by med_school order by correct_percent desc limit '+limitCount,[],function(err,result){
		if (err) {
			console.log(err);
			res.send({'error':err});
		}
		else {
			res.send(result);
		}
	})
};

exports.getTopCategories = function(req, res) {
	var limitCount = req.params.limit;
	db.query('select ifnull(b.profession,"Unknown") as category,count(1) as case_taken, sum(result = 1) as correct, sum(result = 1) / count(1) * 100 as correct_percent from mmwr_case.user_history as a left join mmwr_case.user as b on a.user_id = b.user_id where leaderboard_opt_category = "1" group by b.profession order by correct_percent desc limit '+limitCount,[],function(err,result){
		if (err) {
			console.log(err);
			res.send({'error':err});
		}
		else {
			res.send(result);
		}
	})
};
exports.getUserProfile = function(req,res){
	var userId = req.params.userId;
	if (userId == -1) {
		db.query('select * from mmwr_case.user where enabled <> 2',[],function(err,result){
			//console.log(result);
			if (err) {
				res.send({'error':err});
			}
			else {
				result.forEach(function(user){
					delete user.salt;
					delete user.hash_password;
				})
				res.send(result);
			}
		})
	}
	else {
		db.query('select * from mmwr_case.user where user_id = ?',[userId],function(err,result){
			//	console.log(result);
			if (err) {
				res.send({'error':err});
			}
			else {
				delete result[0].salt;
				delete result[0].hash_password;
				res.send(result);
			}
		})
	}

};


exports.updateUserProfile = function(req,res){
	var userData = req.body;
	var userId = userData.user_id;
	console.log(userData);
	delete userData.password;  // remove un-needed field
	delete userData.changed;
	delete userData.user_nameEdit;
	delete userData.emailEdit;
	delete userData.passwordEdit;
	delete userData.user_id;
	if (userData.newPassword && userData.newPassword != ''){
		userData.salt = encrypt.createSalt();
		userData.hash_password  = encrypt.hashPwd(userData.newPassword,userData.salt);

	}
	delete userData.newPassword;
	delete userData.confirmPassword;
	delete userData.passwordChanged;
	//userData.hash_password = userData.password;
	//userData.med_school = null;

	db.query('update mmwr_case.user set ? where user_id = ?',[userData,userId],function(err,result){
		if (err) {
			console.log(err);
			res.send({'error':err});
		}
		else {
			console.log(result);
			if (result.changedRows > 0) {
				res.send({'success':'Profile updated'});
			}
			else {
				res.send({'success':'nothing changed'});
			}
		}
	})
};

exports.removeUser = function(req,res) {
	var user_id = req.body.user_id;
	db.query('update mmwr_case.user set enabled = 2 where user_id = ?',[user_id],function(err,result){
		//	console.log(result);
		if (err) {
			res.send({'error':err});
		}
		else {
			if (result.changedRows > 0) {
				res.send({'success':'Profile delete'});
			}
			else {
				res.send({'success':'nothing changed'});
			}
		}
	})
};

function reformatForMySQL(arrayObject) {
	// this function reformat json data into format usable for insert and upddate records to mySql database

			var colNames = Object.keys(arrayObject[0]);
			var newValueSet = [];
			var newValues =[];
			for(var i = 0; i < arrayObject.length; i++){
				for (j=0; j < colNames.length; j++) {
					newValues.push(arrayObject[i][colNames[j]]);
				}
				newValueSet.push('("' + newValues.join('","') + '")');
				newValues=[];
			}
	return { 'colNames': colNames, 'valueSet': newValueSet} ;
}

