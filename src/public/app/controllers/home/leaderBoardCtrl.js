angular.module('app').controller('leaderBoardCtrl', function($scope, $http, $modal, ngCase) {


    $scope.limitCount = 5;
    getTopLeaders($scope.limitCount);
    getTopSchools($scope.limitCount);

    function getTopLeaders(limit) {
        ngCase.getTopLeaders(limit)
            .success(function(leaders) {
     //           console.log('leaders ',leaders);
                $scope.leaders = leaders;
             })
            .error(function(err) {
                console.log('Unable to get learderboard data');
            });
    };

    function getTopSchools(limit) {
        ngCase.getTopSchools(limit)
            .success(function(schools) {
               // console.log(schools);
                $scope.schools = schools;
            })
            .error(function(err) {
                console.log('Unable to get schools data');
            });
    };
    $scope.animationsEnabled = true;

});