angular.module('app').controller('abstractCtrl', function($scope,$stateParams, ngCase, $modal, $state, dialogs) {
	$scope.case;

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

	//MODAL
	$scope.animationsEnabled = true;

	$scope.openModal = function(size,image) {

		var modalInstance = $modal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'partials/case/viewImageModal',
			controller: 'viewImageModalCtrl',
			size: size,
			resolve: {
				image: function() {
					return image;
				}
			}
		});

		modalInstance.result.then(function() {

		});
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