angular.module('app').controller('loginCtrl',function($scope,$http,ngIdentity,ngNotifier,ngAuth,$location,$window,$log,$modal, $state,ngCase,$rootScope){
	$scope.identity = ngIdentity;
	$scope.userHistory;
	$scope.userProfile = {};
	$scope.registrationData = {};
	$scope.masterData;
	getMasterData();
	$scope.login = function(email, password){
		ngAuth.authenticateUser(email,password).then(function(success) {  
			
			if(success) {
				// get user history if logged in
				ngCase.getUserHistory($scope.identity.currentUser.user_id).then(function (result) {
						$scope.userHistory = result.data;
						$rootScope.$emit('historyAvailable',$scope.userHistory);
				});
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

	$scope.createLogin = function(isValid) {
		// validation?
		//var newUserData = {
		//	email: $scope.email,
		//	password: $scope.password,
		//	first_name: $scope.firstName,
		//	last_name: $scope.lastName
		//};
		//console.log('vadiation status ', isValid);
		if (isValid) {
			$http.post('/api/mmwrcase/createLogin', $scope.registrationData).then(function (res) {
				if (res.data.success) {
					ngNotifier.notify("Registration successful.  Please continue to login.")
					$scope.ok();
				}
				else {
					ngNotifier.notifyError('Registrattion not success, please contact site Administrator for assistance');
				}
			});
		}
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

	$scope.showSettings = function(size) {
				var modalInstance = $modal.open({
					animation: $scope.animationEnabled,
					templateUrl: 'partials/userInfoModal',
					controller: 'userSettingsModalCtrl',
					size:size,
					keyboard : false,
					backdrop: 'static',
					resolve: {
						userId: function () {
							return $scope.identity.currentUser.user_id;
						},
						masterData : function() {
							return $scope.masterData
						},
						matchMedSchool : function() {
							return $scope.matchMedSchool;
						}

					}
				});
			modalInstance.result.then(function() {

				});

	};




	function getMasterData(){

		$http.get('/api/mmwrcase/getMasterData').then(function(res) {
			$scope.masterData = res.data;
			//console.log('get master data called ', $scope.masterData);
			$rootScope.$emit('masterDataAvailable',$scope.masterData);
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

var userSettingsModalCtrl = function($scope,$modalInstance,$http,ngNotifier,userId,masterData,matchMedSchool){
	$scope.masterData = masterData;
	$scope.matchMedSchool = matchMedSchool;
	$scope.bckProfile = {};
	$scope.userProfile ={};
	$scope.editingFlags = {};
	$http.get('/api/mmwrcase/getUserProfile/'+userId).then(function(res) {
		if (res.data) {
			$scope.userProfile = res.data[0];
			$scope.userProfile.password = '**********';
			$scope.userProfile.newPassword ='';
			$scope.userProfile.confirmPassword='';
			$scope.bckProfile = angular.copy($scope.userProfile);
		//	console.log($scope.userProfile);
		}
	});


	$scope.editUserProfile = function(fieldName,mode) {
		var editingField = fieldName + 'Edit'
		//console.log(editingField);
		if (mode == 'edit') {
			$scope.editingFlags[editingField] = true;

		}
		else if (mode == 'cancel') {
			$scope.userProfile[fieldName] = $scope.bckProfile[fieldName];
			$scope.editingFlags[editingField] = false;
		}
		else {
			$scope.editingFlags[editingField] = false;
			// check for duplicate user_name, email here
			if (fieldName == 'email') {
				$http.get('/api/mmwrcase/checkEmailExist/'+ $scope.userProfile.email).then(function(res) {
					if (res) {
						ngNotifier.notifyError('Sorry, this email address is already being used for this site.  Please use another email.');
						$scope.editingFlags[editingField] = true;
					}
				})
			}
			else if (fieldName == 'user_name') {
				$http.get('/api/mmwrcase/checkUserNameExist/'+ $scope.userProfile.user_name).then(function(res) {
					if (res) {
						ngNotifier.notifyError('Sorry, this user name is already exist.  Please use another user name.');
						$scope.editingFlags[editingField] = true;
					}
				})

			}

		}
	};

	$scope.userProfileChanged = function() {
		return JSON.stringify($scope.bckProfile) != JSON.stringify($scope.userProfile);
		//return !angular.equals($scope.bckProfile,$scope.userProfile);
	}

	$scope.passwordMatched = function(){
		//console.log($scope.userProfile);
		return (($scope.userProfile.newPassword == $scope.userProfile.confirmPassword) && $scope.userProfile.newPassword != '')
	};

	$scope.updateProfile = function (isValid){
		if (isValid) {
			$http.post('/api/mmwrcase/updateUserProfile', $scope.userProfile).then(function (res) {
			//	console.log(res);
				if (res.data.success) {
					ngNotifier.notify("Update successful!")
					$scope.ok();
				}
				else {
					ngNotifier.notifyError('Update failed! Please contact site Administrator for assistance');
				}
			});
		}
	}

	function updateFlagsOff(){
		return (JSON.stringify($scope.editingFlags).indexOf('true') == -1);
	}
	$scope.okToSave = function() {
		return $scope.userProfileChanged() && updateFlagsOff();
	}

	$scope.ok = function () {

		$modalInstance.close();
	};

	$scope.cancel =  function() {
		$modalInstance.dismiss('cancel');
	}
}