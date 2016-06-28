angular.module('app').controller('rootCtrl', function($scope, $http, ngCase, $state, $modal, ngIdentity, ngAuth,$rootScope) {
	getAvailableCases();
	$scope.identity = ngIdentity;
	$scope.userHistory;

	$rootScope.$on('historyAvailable', function (event, data) {
		//console.log('from rootscope listenter ',data);
		$scope.userHistory = data;
	});

	function getAvailableCases() {
		ngCase.getAllAvailCases()
			.success(function(cases){
				$scope.searchableCases = cases;
			})
			.error(function(err) {
				console.log('Case data unvailable');
			});
	}

	$scope.selected = function($item){
		$state.go('overview',{caseID:$item.case_id});
	};

	$scope.animationEnabled = true;

	$scope.taken = function(caseId) {
		if ($scope.identity.currentUser != null && $scope.userHistory){
		var takenCase = 	_.find($scope.userHistory,function(oneCase){
			return oneCase.case_id == caseId;
			});
		return takenCase.date_completed;
		}
	}
	

	
});