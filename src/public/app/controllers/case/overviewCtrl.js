angular.module('app').controller('overviewCtrl', function($scope, ngCase, $stateParams,$state, dialogs, $modal) {
	$scope.case;
	$scope.preview = $stateParams.preview;
	(function(){
		ngCase.getCaseById($stateParams.caseID)
			.success(function(caseData){
				 if (!caseData.error) { // actual case found
					$scope.case = caseData;
				 } else { 
				 	console.log('Unable to retrieve case data for case: ' + $stateParams.caseID);
				  	$scope.openCaseNotFoundModal('md')
				}
			})
			.error(function(err){
				console.log('Unable to retrieve case data: '+err);
			});
		function getCase() {}
	})();

	$scope.openCaseNotFoundModal = function(size) {

		var modalInstance = $modal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'partials/home/caseNotFoundModal',
			controller: 'caseNotFoundModalCtrl',
			size: size
		});

		modalInstance.result.then(function() {
			
  		});
	};

	$scope.exit = function() {
		ngCase.exitMode($scope.preview)
	};


});

angular.module('app').controller('caseNotFoundModalCtrl', function ($scope, $modal, $modalInstance, $state) {
	
	$scope.ok = function() {
		$modalInstance.close();
		$state.go('home');
		
	};

	$scope.cancel =  function() {
		$modalInstance.dismiss('cancel');
		$state.go('home');
	}
});