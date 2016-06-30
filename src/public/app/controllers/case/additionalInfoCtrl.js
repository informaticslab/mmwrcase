angular.module('app').controller('additionalInfoCtrl', function($scope,$stateParams, ngCase, $modal, $http, dialogs,$window,ngIdentity) {
	$scope.case;
	$scope.max = 5;
	$scope.isReadOnly = false;
	$scope.caseRating = null;
	$scope.preview = $stateParams.preview;
	
	$scope.hoveringOver = function(value) {
		$scope.overStar = value;
		$scope.percent = 100 * (value / $scope.max);
	};

	(function(){
		ngCase.getCaseById($stateParams.caseID)
			.success(function(caseData){
				$scope.case = caseData;
			})
			.error(function(err){
				console.log('Unable to retrieve case data: '+err);
			});
		function getCase() {}
	})();

	$scope.rateCase = function() {
		if($scope.caseRating != null){
			var data = {caseId: $scope.case.case_id, rating: $scope.caseRating};
			if (ngIdentity.currentUser) {
				data.user_id = ngIdentity.currentUser.user_id;
			}
		//	console.log('ratecase data ', data);
			$http.post('/api/mmwrcase/updateRating', data).then(function(res){
//				console.log(res);
			});
		}
		
	};

	$scope.exit = function() {
		ngCase.exitMode($scope.preview)
	};

	$scope.exitCase = function() {
		$window.close();
	};
});