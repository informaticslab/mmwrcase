angular.module('app').controller('leaderBoardCtrl', function($scope, $http, $modal, ngCase) {


    $scope.limitCount = 5;
    getTopLeaders($scope.limitCount);
    //getTopOrganizations($scope.limitCount);
    getTopCategories($scope.limitCount);

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

    function getTopOrganizations(limit) {
        ngCase.getTopOrganizations(limit)
            .success(function(schools) {
               // console.log(schools);
                $scope.organizations = schools;
            })
            .error(function(err) {
                console.log('Unable to get organizations data');
            });
    };
    function getTopCategories(limit) {
        ngCase.getTopCategories(limit)
            .success(function(categories) {
                // console.log(schools);
                $scope.categories = categories;
            })
            .error(function(err) {
                console.log('Unable to get categories data. Err: ',err);
            });
    };
    $scope.animationsEnabled = true;

});