angular.module('app').controller('createCaseCtrl', function ($scope,$http,$window,$log,ngCase,Upload,ngNotifier,$state,dialogs) {

$scope.developmentStatuses;
$scope.displayStatuses;
$scope.galleryStatus = {'open':false};
$scope.minAnsRequired = 2;

getDisplayStatus();
getDevStatus();

$scope.case = {
	"case_id"	: null,
	"title"	: "",
	"overview":"",
	"created_date" : null,
	"publication_date" :null,
	"case_text" : "",
	"abstract_text" : "",
	"additional_information" :"",
	"rating"	: 0,
	"development_status"	: 0,
	"display_status"	: 2,
	"available_cme_credits" : 0,
	"cme_release_date"	: null,
	"cme_valid_until"	: null,
	"number_cme_credits_available" : null,
	"tag_line"  : "",
	"last_edited"	: null
}



$scope.imageUpload = {
	imageFile  : null,
	imageTitle  : '',
	imageCaption : ''
}

var orgImageUpload = angular.copy($scope.imageUpload);

$scope.qa = {
	'pre' :[],
	'post' : []
}

$scope.images = [];

if ($scope.caseId) {
	getCaseData($scope.caseId);
}


$scope.saveCase = function(){
	if ($scope.case.development_status == 5) {
		$scope.publishCase();
	}
	else {
		$scope.saveDraft();
	}
}


$scope.saveDraft = function(originate) {
	 	// validate data before save 
	 if (validateCase()) {
	 	var now = moment().format("YYYY-MM-DDTHH:mm:ss")  // get the current timestamp
	 	if ($scope.case.created_date == null) {
			$scope.case.created_date = now;
		}
		$scope.case.last_edited = now;
		// build overview text
		if ($scope.case.development_status == 5) {
			 if ($scope.case.display_status != 1) {
				$scope.case.publication_date = now;  // overriding publication date to current date if not publishing to up-coming case
			 }
			 else {
			 	if ($scope.case.publication_date == null){ // user selected to publish to upcoming case but did not select a date, default to the current date
			 		$scope.case.publication_date = now; 
			 	}
			 }

		}
		$scope.case.overview = $scope.case.case_text.replace(/<\/?[^>]+>/gi, '').substring(0,400) + '...';
		
			if ($scope.case.case_id == null) {
			//	delete $scope.case.case_id;
				 $http.get('/api/mmwrcase/getNextCaseId').then(function(getIdRes) {
				 	if (getIdRes.data.insertId) {
				 		$scope.case.case_id = getIdRes.data.insertId;
							$http.post('/api/mmwrcase/createCase',$scope.case).then(function(res){
								if (res.data.hasOwnProperty('message')) { // create was success
									// $scope.case.case_id = res.data.caseId;  // retreive newly inserted case id
									 // using the new id for the QAs
									 var combinedQA = $scope.qa.pre.concat($scope.qa.post);
									 for (var i=0; i < combinedQA.length; i++) {
									 	combinedQA[i].question.case_id = $scope.case.case_id;
									 	combinedQA[i].question.question_id = i+1;
									 	combinedQA[i].question.sequence_id = i+1;
									 	delete combinedQA[i].question.editing; 
									 	for (var j = 0 ; j < combinedQA[i].answers.length; j ++) {
									 		combinedQA[i].answers[j].case_id = $scope.case.case_id;
									 		combinedQA[i].answers[j].question_id = combinedQA[i].question.question_id;
									 		combinedQA[i].answers[j].answer_id = j+1;
									 		delete combinedQA[i].answers[j].editing;
									 	}
									 }
									 // saving QA to database
									 if (combinedQA.length > 0) {
									 	$http.post('/api/mmwrcase/createQuestionAnswer',combinedQA).then(function(res){
							               if (res.data.success) {
							                 // alert('question save success');
							                }
							                else {
							                  alert('question save failed')
							                }
							              });
									 }
									 // saving images.  this could move to the back end.
									if ($scope.images.length > 0) {
									 	// populate values before sending to backing
									 	for (var i=0; i < $scope.images.length; i ++) {
									 		$scope.images[i].case_id = $scope.case.case_id;
									 		$scope.images[i].sequence_id = i+1;
									 		$scope.images[i].image_id = i+1;
									 		delete $scope.images[i].editing;
									 	}
									 	$http.post('/api/mmwrcase/saveImages',$scope.images).then(function(res){
							               	if (res.data.success) {
							                 // alert('question save success');
							                }
							                else {
							                  alert('images save failed')
							                }
							            });
									}
									ngNotifier.notify('case saved successfully');
									if (originate == 'publish')	{
											$scope.cancel()
									} else if (originate == 'preview') {
											var url = $state.href('preview', {caseID: $scope.case.case_id, preview :true});
											window.open(url,'_blank');
						        	}
								}
								else {
										alert ('Draft case save failed')
								}
							});
					}
					else {
						console.log("could not get a new case Id")
					}

				})
			}
			else {  // case already exist, update case

					$http.post('/api/mmwrcase/updateCase',$scope.case).then(function(res){
				        if (res.data.success) {
				           var combinedQA = $scope.qa.pre.concat($scope.qa.post);
				            for (var i=0; i < combinedQA.length; i++) {
				              combinedQA[i].question.case_id = $scope.case.case_id;
				              combinedQA[i].question.question_id = i+1;
				              combinedQA[i].question.sequence_id = i+1;
				              delete combinedQA[i].question.editing; 
				              for (var j = 0 ; j < combinedQA[i].answers.length; j ++) {
				                combinedQA[i].answers[j].case_id = $scope.case.case_id;
				                combinedQA[i].answers[j].question_id = combinedQA[i].question.question_id;
				                combinedQA[i].answers[j].answer_id = j+1;
				                delete combinedQA[i].answers[j].editing;
				              }
				           }
				           	if (combinedQA.length > 0 ) {
				            	$http.post('/api/mmwrcase/createQuestionAnswer',combinedQA).then(function(res){
				               if (res.data.success) {
				                  // alert('update success');
				                }
				                else {
				                  alert('update question failed')
				                }
				              });
				        	}
				        	 // saving images.  this could move to the back end.
							if ($scope.images.length > 0) {
							 	// populate values before sending to backing
							 	for (var i=0; i < $scope.images.length; i ++) {
							 		$scope.images[i].case_id = $scope.case.case_id;
							 		$scope.images[i].sequence_id = i+1;
							 		$scope.images[i].image_id = i+1;
							 		delete $scope.images[i].editing;
							 	}
							 	$http.post('/api/mmwrcase/saveImages',$scope.images).then(function(res){
					               if (res.data.success) {
					                 // alert('question save success');
					                }
					                else {
					                  alert('images save failed')
					                }
					              });
							}
				  		      	ngNotifier.notify('case saved successfully');
				        		if (originate == 'publish')	{
									$scope.cancel()
								} else if (originate == 'preview') {
				        			var url = $state.href('preview', {caseID: $scope.case.case_id, preview:true});
									window.open(url,'_blank');
					        	}
				        }
				        else {
				            console.log(res.data)
				         //   alert('update failed with error: ', res.error)
				        }

		    		})

			}
		
	}
};

$scope.publishCase=function() {
	// make sure all required fields are populated
	var currentCaseExist = false;
	if (isEmpty($scope.case.title)) {
		ngNotifier.notifyError('Please enter the title for the case');
	}
	else if (isEmpty($scope.case.tag_line)) {
		ngNotifier.notifyError('Please enter a tag line');
	}
	else if (isEmpty($scope.case.case_text)) {
		ngNotifier.notifyError('Please enter the case text');
	}
	else if (isEmpty($scope.case.abstract_text)) {
		ngNotifier.notifyError('Please enter the abstract');
	}
	else if (isEmpty($scope.case.additional_information)) {
		ngNotifier.notifyError('Please enter text for additional information');
	}
	// else if (isEmpty($scope.case.publication_date)) {
	// 	ngNotifier.notifyError('Please select a publication date');
	// }
	else if ($scope.case.available_cme_credits && $scope.case.number_cme_credits_available == 0 ) {
		ngNotifier.notifyError('Please enter a valid CME credit');
	}
	else if ($scope.case.available_cme_credits && $scope.case.cme_release_date == null ) {
		ngNotifier.notifyError('Please enter a valid CME release date');
	}
	else if ($scope.case.available_cme_credits && $scope.case.cme_valid_until == null ) {
		ngNotifier.notifyError('Please enter a valid CME expiration date');
	}
	else if (!validQA($scope.qa.pre)) {
		ngNotifier.notifyError('Please enter some pre-test question and a minimum of '+ $scope.minAnsRequired + ' answers and select a correct answer');
	}
	else if (!validQA($scope.qa.post)) {
		ngNotifier.notifyError('Please enter some post-test question and a minimum of ' + $scope.minAnsRequired + ' answers and select a correct answer');
	}
	// else if ($scope.images.length == 0) {
	// 	ngNotifier.notifyError('Please enter at least 1 image for the case');
	// }
	else if ($scope.case.display_status < 0 ) {
		ngNotifier.notifyError('Please select a valid publish location');
	}
	else {
		// set publication date to current date
		if ($scope.case.display_status == 1)  {  // future case,  make sure publication date is in the future

			// var d1 = new Date($scope.case.publication_date);
			// var curDate = new Date();
			// if (d1 <= curDate ) {
			// 	ngNotifier.notifyError('You are publishing an upcoming case, Please select a future publication date.');
						
			// }
			// else  {
				$scope.saveDraft('publish');
			// }
		}
		// checking for conflicting status
		// if (!validStatus($scope.case.development_status,$scope.case.display_status)) {
		// 	publishOk = false;
		// 	ngNotifier.notifyError('You have selected an invalid combination of development status and display status.  Please verify and retry');
		// }

		else if ($scope.case.display_status == 0) { 
			ngCase.getCurrentCase()
				.success(function(caseData){
				 	if (caseData.case_id && caseData.case_id != $scope.case.case_id) {
						var dlg = dialogs.confirm('Confirm Activate Current Case','Current Case of the Week already exist, Please confirm that you want to replace the current case with this case');
						dlg.result.then(function(btn){
								$scope.case.replaceCurrent = caseData.case_id;		
								$scope.saveDraft('publish');
						}, function(btn){
							//No
						});
						
					}
					else { // no current case exist, check publish ok flag
					 		$scope.saveDraft('publish');
					}
				})
				.error(function(err){
					console.log('Unable to retrieve case data, not sure of the status of the case: '+err);
				});
		}
		else {
			$scope.saveDraft('publish');
		}

		
	}
	
}

// function validatePublish() {
// 	// make sure all required fields are populated
// 	var currentCaseExist = false;
// 	var publishOk = false;
// 	if (isEmpty($scope.case.title)) {
// 		ngNotifier.notifyError('Please enter the title for the case');
// 	}
// 	else if (isEmpty($scope.case.tag_line)) {
// 		ngNotifier.notifyError('Please enter a tag line');
		
// 	}
// 	else if (isEmpty($scope.case.case_text)) {
// 		ngNotifier.notifyError('Please enter the case text');
		
// 	}
// 	else if (isEmpty($scope.case.abstract_text)) {
// 		ngNotifier.notifyError('Please enter the abstract');
		
// 	}
// 	else if (isEmpty($scope.case.additional_information)) {
// 		ngNotifier.notifyError('Please enter text for additional information');
// 	}
// 	else if (isEmpty($scope.case.publication_date)) {
// 		ngNotifier.notifyError('Please select a publication date');
// 	}
// 	else if ($scope.case.available_cme_credits && number_cme_credits_available == 0 ) {
// 		ngNotifier.notifyError('Please enter a valid CME credit');
// 	}
// 	else if ($scope.case.available_cme_credits && cme_release_date == null ) {
// 		ngNotifier.notifyError('Please enter a valid CME release date');
// 	}
// 	else if ($scope.case.available_cme_credits && cme_valid_until == null ) {
// 		ngNotifier.notifyError('Please enter a valid CME expiration date');
// 	}
// 	else if (!validQA($scope.qa.pre)) {
// 		ngNotifier.notifyError('Please enter some pre-test question and a minimum of '+ $scope.minAnsRequired + ' answers and select a correct answer');
// 	}
// 	else if (!validQA($scope.qa.post)) {
// 		ngNotifier.notifyError('Please enter some post-test question and a minimum of ' + $scope.minAnsRequired + ' answers and select a correct answer');
// 	}
// 	else if ($scope.images.length == 0) {
// 		ngNotifier.notifyError('Please enter at least 1 image for the case');
// 	}

// 	else {
		
// 		if ($scope.case.display_status == 1)  {  // future case,  make sure publication date is in the future
// 			var d1 = new Date($scope.case.publication_date);
// 			var curDate = new Date();
// 			if (d1 <= curDate ) {
// 				ngNotifier.notifyError('You are publishing an upcoming case, Please select a future publication date.');
						
// 			}
// 		}
// 		// checking for conflicting status
// 		if (!validStatus($scope.case.development_status,$scope.case.display_status)) {
// 			ngNotifier.notifyError('You have selected an invalid combination of development status and display status.  Please verify and retry');
// 		}

// 		if ($scope.case.display_status == 0) { 
// 			ngCase.getCurrentCase()
// 				.success(function(caseData){
// 				 	if (caseData.case_id && caseData.case_id != $scope.case.case_id) {
// 				 		var dlg = dialogs.confirm('Confirm Activate Current Case','Current Case of the Week already exist, Please confirmat you want to replace the current case with this case');
// 				 		dlg.result.then(function(btn){
// 							ngcase.replaceCurrent(caseData.case_id, $scope.case.case_id).success(function(){
// 								ngNotifier.notify('Current Case has been successfully replaced');
// 								// close the modal here
// 							})
// 						}, function(btn){
// 							//No
// 							return false;
// 						});
// 				//		ngNotifier.notifyError('Only one current case allowed.  Do you want to replace the current case with this case?');
						
// 					}
// 					else { // no current case exist, check publish ok flag

// 						return true;
// 					}
// 				})
// 				.error(function(err){
// 					return false;
// 					console.log('Unable to retrieve case data, not sure of the status of the case: '+err);
// 				});
// 		}
		
// 	}
	
// }
function getCaseData(caseId) {
	ngCase.getCaseById(caseId)
			.success(function(caseData){
				$scope.case = caseData;
				if ($scope.case.QA.length > 0) {
					// the case has some questions
					for (var i = 0; i < $scope.case.QA.length; i++) {
							var oneQA = {
								'question' 	: $scope.case.QA[i].question,
								'answers'	: $scope.case.QA[i].answers 
							}
						$scope.qa[$scope.case.QA[i].question.post_pre].push(oneQA);
						
					}
				}
				if ($scope.case.images.length > 0) {
					$scope.images = $scope.case.images;
				}
			})
			.error(function(err){
				console.log('Unable to retrieve case data: '+err);
	});
}

	function getDisplayStatus() {
		ngCase.getDisplayStatus()
			.success(function(statuses) {
				$scope.displayStatuses = statuses;
			})
			.error(function(err) {
				console.log('Unable to load statuses');
			});
	}
	
	function getDevStatus() {
		ngCase.getDevStatus()
			.success(function(statuses) {
				$scope.developmentStatuses = statuses;
			})
			.error(function(err) {
				console.log('Unable to load statuses');
			});
	}

$scope.publication_date = moment().format();

$scope.uploadFile = function(imageUpload) {
	var files = imageUpload.imageFile;
  if(files) {
    // for(var i = 0; i < files.length; i++) {
      var file = files;
   //   console.log('file data ', file);
      //console.log('FILES********',file);
      Upload.upload({
        url:'/api/fileUpload',
        file: file,
        fields: {
          'image_id': 0,
          'case_id': 0,
          'sequence_id' : 0,
          'image_url':'',
          'featured'	: 0,
          'title'	: imageUpload.imageTitle,
          'caption'	: imageUpload.imageCaption
        }
      }).progress(function(evt) {
        var progressPercentage = parseInt(100.0*evt.loaded / evt.total);
        //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
      }).success(function(data, status, header, config) {
        //file is uploaded successfully, attach to $scope.images
        data.case_id = $scope.case.case_id;
        data.sequence_id = $scope.images.length+1;
        $scope.images.push(data);
        $scope.galleryStatus.open = true;
         ngNotifier.notify('Image uploaded successfully.');
      }).error(function(data, status, header, config){
        console.log('error in uploading file' + file.$error);
      });
           // clear out the fields
   		$scope.resetUpload();
    }
  // }
};

  $scope.deleteFile = function(image, index) {
    var deleteConfirm = $window.confirm('Are you sure you want to delete this image?');
    if (deleteConfirm) {
      $http.post('/api/fileUpload/delete/', image).then(function(res) {
        if (res.data.success) {
          $scope.images.splice(index, 1);
          ngNotifier.notify('Image successfully deleted.')
        } else {
          console.log('Deletion Failed');
          ngNotifier.notifyError('Error. Image unabled to be deleted.')
        }
      });
    }


  };

$scope.publicationDateChanged = function (newDate, oldDate) {
    //console.log(newDate);
    //console.log(oldDate);
    $scope.publication_date = newDate;
}

$scope.addQuestion = function(qa,type,e) {
    if (!qa.newQuestionText || qa.newQuestionText.length === 0) {
      return;
    }
   
    var questionText = qa.newQuestionText;
    if (questionText.length > 0) {
    	// construct a question object before pushing
    	var newQA = {
    		'question' : {
		    		'question_id': $scope.qa.length,
		    		'case_id' : $scope.case.case_id || null,
		    		'post_pre': type,
		    		'question': questionText
    		},
    		answers : []
    	}
    //  console.log(newQuestion);
      qa.push(newQA);
    }
    qa.newQuestionText ="";
    e.preventDefault();
  };

 
  $scope.removeQuestion = function(qa, question) {
    var index = qa.indexOf(question);
    if (index > -1) {
      qa.splice(index, 1)[0];
    }
  };

  

  $scope.addAnswer = function(question,e) {
    
    if (!question.newAnswerText || question.newAnswerText.length === 0) {
      return;
    }
    // contruct answer object here
    var newAnswer = {
    	'answer_id' :  question.answers.length,
    	'question_id'	: question.question.question_id,
       	'case_id': $scope.case.case_id,
    	'answer' : question.newAnswerText,
    	'correct': 0,
    	'hit_counter' : 0
    }
    question.answers.push(newAnswer);
    question.newAnswerText = '';
    e.preventDefault();
    // topic.save();
  };

  $scope.removeAnswer = function(question, answer) {
    var index = question.answers.indexOf(answer);
    if (index > -1) {
      question.answers.splice(index, 1)[0];
    }
    // topic.save();
    //}
  };

  $scope.editQuestion = function(question) {
    question.editing = true;
  };

  $scope.cancelEditingQuestion = function(question) {
   question.editing = false;
  };

  $scope.saveQuestion = function(question,e) {
    //question.save();
   question.editing = false;
    e.preventDefault();
  };

  
  $scope.saveQuestions = function() {
    for (var i = $scope.qa.length - 1; i >= 0; i--) {
      var question = $scope.qa[i];
     question.sortOrder = i + 1;
      //question.save();
    }
  };

  
  $scope.editAnswer = function(answer) {
    $log.debug("edit subquestion",answer);
    answer.editing = true;
  };

  $scope.saveAnswer = function(answer,e) {
    //question.save();
    answer.editing = false;
    e.preventDefault();
  };

$scope.options = {
    accept: function(sourceNode, destNodes, destIndex) {
      var data = sourceNode.$modelValue;
      if (data.hasOwnProperty('question')) {
         sourceType = 'question';
      } else if (data.hasOwnProperty('answer')) {
         sourceType = 'answer';
      }

     var destType = destNodes.$element.attr('data-type');
      return (sourceType == destType); // only accept the same type
    },
    dropped: function(event) {
      $log.debug(event);
      var sourceNode = event.source.nodeScope;
      var destNodes = event.dest.nodesScope;
      // update changes to server
   },
    beforeDrop: function(event) {
      // if (!window.confirm('Are you sure you want to drop it here?')) {
      //   event.source.nodeScope.$$apply = false;
      // }
    }
  };

 $scope.setCorrectAnswer = function(question,answer) {
	for (var i=0; i < question.answers.length; i++) {
		question.answers[i].correct = 0;
	}
	answer.correct = 1;
}


$scope.setFeatureImage = function(images,image) {
	for (var i=0; i < images.length; i++) {
		 images[i].featured = 0;
	}
	image.featured = 1;
}

$scope.resetUpload = function() {
	$('#uploadThumb').attr('src','');
	$scope.imageUpload = angular.copy(orgImageUpload);
}

 $scope.editImage = function(image) {
      image.editing=true;
 }


 $scope.saveImage = function(image) {
      image.editing=false;
  };

 function validateCase() {
 	var noError = true;
 	if (isEmpty($scope.case.title)){
 		ngNotifier.notifyError('Please enter a title for the case');
 		noError = false;
 	}
 	return noError
 }

function isEmpty(inputStr) { 
	if ( inputStr == null || inputStr =='' )
		 { return true; }
	return false;
}
 
function validQA(qa) {
	var correctSelected = false;
	if (qa.length == 0) {
		return false;
	}
	else {
		for (var i = 0; i < qa.length; i ++) {
			if (qa[i].answers.length  < $scope.minAnsRequired) {
				return false;
			}
			else {
				for (var j = 0; j < qa[i].answers.length; j++) {
					if (qa[i].answers[j].correct == 1) {
						 correctSelected = true;
						 break;
					}
				}
				if (!correctSelected) {
					return false
				}
			}
		}
		return true;
	}
}
function validStatus(development_status, display_status) {
	if (development_status == 5 && display_status == 3) {
		return false;
	}
	else if (development_status == 0 && display_status < 3 ) { 
		return false;
	}
	return true;
}

$scope.copyQuestion = function(frm,to) {
		$scope.qa[to] = angular.copy($scope.qa[frm]);
		for (var i = 0; i < $scope.qa[to].length ; i++){
			$scope.qa[to][i].question.post_pre = to;
		}
}

$scope.previewCase = function() {
	$scope.saveDraft('preview');
	
}

$scope.confirmCancel = function() {
		var dlg = dialogs.confirm('Confirmn Close Edit', 'Please save your changes before exit.  Click yes to continue');
		dlg.result.then(function(btn){
			$scope.cancel()
		}, function(btn){
			//No
		});
	};
});


