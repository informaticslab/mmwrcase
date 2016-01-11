angular.module('app').controller('currentCaseCtrl', function($scope, ngCase) {
	//ratings
	$scope.max = 5;
	$scope.isReadOnly = true;
	$scope.numberTopCases = 3;

	$scope.hoveringOver = function(value) {
		$scope.overStar = value;
		$scope.percent = 100 * (value / $scope.max);
	};

	(function() {
		ngCase.getCurrentCase()
			.success(function(currentCase){
				$scope.currentCase = currentCase;
				//console.log($scope.currentCase);
				for(var i =0; i < $scope.currentCase.images.length; i++) {
					if($scope.currentCase.images[i].featured === 1) {
						$scope.featuredImageUrl = $scope.currentCase.images[i].image_url;
					}
				}
				// ngCase.getRating($scope.currentCase.case_id)
				// .success(function(ratingData) {
				// 	//console.log('rating data ',ratingData);
				// 	$scope.currentCase['ratedCount'] = ratingData[0].rated_count;
				// })
				// .error(function(err1) {
				// 	console.log('rating not available');
				// })
			})
			.error(function(err) {
				console.log('Case data unvailable');
			});
		function getCurrentCase() {}
	})();

	(function(){
		ngCase.getTopRateCases($scope.numberTopCases)
			.success(function(topCases) {
				$scope.topCases = topCases;
	//			console.log(topCases);
			})
			.error(function(err) {
				console.log('Case data unvailable');
			});
		function getTopRatedCases() {}
	})();



});