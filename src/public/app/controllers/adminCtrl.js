angular.module('app').controller('adminCtrl', function($scope, ngCase,$modal,$window,$http,$state,$rootScope,$state,$stateParams,ngNotifier) {
    $scope.masterData;
    $scope.users;
    $scope.inputRoles;
    $scope.outputRoles = [];
    getMasterData();
    $http.get('/api/mmwrcase/getUserProfile/'+'-1').then(function(res) {
        if (res.data) {
            $scope.users = res.data;
        }
    });

    $scope.updateUserType = function(user) {
       // console.log(user);
        ngCase.updateUserProfile(user);
    }

    $scope.removeUser =  function(user) {
       // console.log(user);
        if (user.user_name == '') {
            user.user_name = user.display_name;
        }
        var answer = confirm('Are you sure you want to delete user '+ user.user_name + ' ?');
        if (answer) {
            $http.post('/api/mmwrase/removeUser', user).then(function(res) {
                //console.log(user);
                if (res.data.success) {
                    ngNotifier.notify('You have deleted user '+ user.user_name);
                } else {
                    ngNotifier.notifyError('Error deleteing user');
                }
            });
            $state.transitionTo($state.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        }
    };

    $scope.resetPassword = function(user) {
        user.newPassword = 'Password1!';
        ngCase.updateUserProfile(user);
        ngNotifier.notify('You have reset the password for user '+ user.user_Name + ' to the default passwor: "Password1!"')
    };

    function getMasterData(){

        $http.get('/api/mmwrcase/getMasterData').then(function(res) {
            $scope.masterData = res.data;
            //console.log('get master data called ', $scope.masterData);
            $rootScope.$emit('masterDataAvailable',$scope.masterData);
        });
    }
});
