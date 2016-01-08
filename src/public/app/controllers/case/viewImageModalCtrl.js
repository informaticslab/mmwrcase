angular.module('app').controller('viewImageModalCtrl', function ($scope, $modal, $modalInstance, image,imagesCount) {
	$scope.image = image;
	$scope.imagesCount = imagesCount;
	
	$scope.ok = function() {
		$modalInstance.close();
	};

	$scope.cancel =  function() {
		$modalInstance.dismiss('cancel');
	}
});