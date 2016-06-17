angular.module('app').controller('testCtrl', function($scope, ngTest, ngCase, $stateParams, $state, dialogs,$window,ngIdentity) {
	$scope.case;
	$scope.input = {};
	$scope.preview = $stateParams.preview;
	
	ngTest.getQuestions($stateParams.caseID, $stateParams.testType).then(function(data) {
		$scope.questions = data;
		//console.log($scope.questions);
	});
	
	ngCase.getCaseById($stateParams.caseID).success(function(caseData){
		$scope.case = caseData;
		//console.log($scope.case);
	}).error(function(err){
		console.log('Unable to retrieve case data: '+err);
	});
	

	$scope.checkAnswer = function() {
	//	console.log($scope.questions);
	//	console.log($scope.questions.selectedAnswer);
		// may need to update hit counter here pending clarification.  
	 	if(!$scope.preview && $stateParams.testType != 'pre') {	
			ngCase.updateHitCounter($stateParams.caseID,$scope.questions.question.question_id,$scope.questions.selectedAnswer);
		}
        for(var i = 0; i < $scope.questions.answers.length; i++){
        	if ($scope.questions.answers[i].answer_id == $scope.questions.selectedAnswer){
        			// found matching answer
        	//		return $scope.questions.answers[i].correct == 1;
    	    		// or do something else here		
        		}
       	} 
		
       	if ($stateParams.preview) {
       		$state.go('previewResults',{caseID : $stateParams.caseID, testType: $stateParams.testType, questionID :$scope.questions.question.question_id, selectedAnswerID :  $scope.questions.selectedAnswer, preview:'p'});
       	}
       	else {
			$state.go('results',{caseID : $stateParams.caseID, testType: $stateParams.testType, questionID :$scope.questions.question.question_id, selectedAnswerID :  $scope.questions.selectedAnswer});
		}
	};	 

	$scope.exit = function() {
		ngCase.exitMode($scope.preview)
	};
});