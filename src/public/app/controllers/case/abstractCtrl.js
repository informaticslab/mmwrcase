angular.module('app').controller('abstractCtrl', function($scope,$stateParams, ngCase, $modal, $state, dialogs,$window) {
	$scope.case;
	$scope.preview = $stateParams.preview;
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

	$scope.openModal = function(size,image,imagesCount) {

		var modalInstance = $modal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'partials/case/viewImageModal',
			controller: 'viewImageModalCtrl',
			size: size,
			resolve: {
				image: function() {
					return image;
				},
				imagesCount : function() { 
					return imagesCount;
				}
			}
		});

		modalInstance.result.then(function() {

		});
	};

	$scope.exit = function() {
		ngCase.exitMode($scope.preview)
	};

});