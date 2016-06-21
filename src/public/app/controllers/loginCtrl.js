angular.module('app').controller('loginCtrl',function($scope,$http,ngIdentity,ngNotifier,ngAuth,$location,$window,$log,$modal, $state){
	$scope.identity = ngIdentity;
	$scope.newRegistration = {};
	$scope.masterData = getMasterData();
	$scope.login = function(email, password){
		ngAuth.authenticateUser(email,password).then(function(success) {  
			
			if(success) {
				$state.go('home');
				$scope.ok();
			} else {
				//$log.debug(success);
				ngNotifier.notifyError('Incorrect Email/Password');
			}
		});
		
	};

	$scope.logout = function() {
		ngAuth.logoutUser().then(function() {
			$state.go('home');
		});
	}

	$scope.openLogin = function(size) {
		var modalInstance = $modal.open({
			animation: $scope.animationEnabled,
			templateUrl: 'partials/loginModal',
			controller: 'loginModalInstanceCtrl',
			size:size
		});

		modalInstance.result.then(function() {

		});
	};

	$scope.showRegistration = function(size) {
		$scope.registrationData = {};
		var modalInstance = $modal.open({
				animation: $scope.animationEnabled,
				templateUrl: 'partials/registrationModal',
				controller: 'registrationModalInstanceCtrl',
				size:size,
				keyboard : false,
				backdrop: 'static'
		});
		modalInstance.result.then(function() {

		});
	};

	$scope.createLogin = function() {
		// validation?
		//var newUserData = {
		//	email: $scope.email,
		//	password: $scope.password,
		//	first_name: $scope.firstName,
		//	last_name: $scope.lastName
		//};
		$http.post('/api/mmwrcase/createLogin',$scope.registrationData).then(function(res){
			if(res.data.success) {
				ngNotifier.notify("Registration successful.  Please continue to login.")
				$scope.ok();
			}
			else {
				ngNotifier.notifyError('Registrattion not success, please contact site Administrator for assistance');
			}
		});
	}

	$scope.matchMedSchool = function(val){
		return _.filter($scope.masterData.medicalSchools, function(school) {
			return school.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
		})
	}

	$scope.setMedicalSchool = function(school) {
		//console.log('school selected ', school);
		$scope.registrationData.med_school = school._name;
	}

	function getMasterData(){
		$http.get('/api/mmwrcase/getMasterData').then(function(res) {
			$scope.masterData = res.data;
		});
	}

});


var loginModalInstanceCtrl = function($scope, $modalInstance) {

	$scope.ok = function () {
    $modalInstance.close();
  };

	$scope.cancel =  function() {
		$modalInstance.dismiss('cancel');
	}
}

var registrationModalInstanceCtrl = function($scope, $modalInstance) {

	$scope.ok = function () {
		$modalInstance.close();
	};

	$scope.cancel =  function() {
		$modalInstance.dismiss('cancel');
	}
}