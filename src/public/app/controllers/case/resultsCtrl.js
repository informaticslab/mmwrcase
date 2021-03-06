angular.module('app').controller('resultsCtrl', function($scope, ngTest, ngCase, $stateParams,$state, dialogs) {
	//ngTest.getQuestions($stateParams.caseID).then(function(data) {
	ngTest.getQuestions($stateParams.caseID, $stateParams.testType).then(function(data) {
		$scope.questions = data;
	  //console.log($scope.questions);
	});
	
	$scope.answerStats={};
	$scope.selectedAnswer = $stateParams.selectedAnswerID;

	ngCase.getCaseById($stateParams.caseID).success(function(caseData){
		$scope.case = caseData;
		//console.log($scope.case);
		ngCase.getAnswerStats($stateParams.caseID,$stateParams.questionID).success(function(statData) {
			$scope.answerStats = statData;
		});
	}).error(function(err){
		console.log('Unable to retrieve case data: '+err);
	});


	$scope.goNext = function() {
		if ($scope.moreQuestions) {
	   		$state.go('test',{caseID : $stateParams.caseID, questionID :$scope.questions.question.question_id});
	   	}
		else {
			if ($scope.questions.question.post_pre == 'pre') {
				$state.go('abstract',{caseID : $stateParams.caseID});
			}
			else {
				$state.go('additionalInfo',{caseID : $stateParams.caseID});
			}
		}
	};

	$scope.exit = function() {
		var dlg = dialogs.confirm();
		dlg.result.then(function(btn){
			$state.go('home');
		}, function(btn){
			//No
		});
	};

});