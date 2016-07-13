var mmwrcase = angular.module('app', [
  //'ngRoute'
  ,'ui.router'
  ,'ngResource'
  ,'ngAnimate'
  ,'ngSanitize'
  // ,'LocalStorageModule'
  ,'ui.tree'
  ,'ui.bootstrap'
  ,'ui.bootstrap.datetimepicker'
  // ,'chieffancypants.loadingBar'
  // ,'angulartics'
  // ,'angulartics.google.analytics'
  ,'dialogs.main'
  ,'textAngular'
  ,'highcharts-ng'
  ,'ngFileUpload'
]);

var stateRoleChecks = {
  isAdmin:{auth: function(ngAuth){
    return ngAuth.authorizeCurrentUserForRoute('admin');
  }},
  isAuthor:{auth: function(ngAuth){
    return ngAuth.authorizeCurrentUserForRoute('author');
  }},
  isUser:{auth: function(ngAuth){
    return ngAuth.authorizeCurrentUserForRoute('user');
  }}
};


//to prevent IE caching
mmwrcase.config([
    '$httpProvider', function ($httpProvider) {
        // Initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        // Enables Request.IsAjaxRequest() in ASP.NET MVC
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

        // Disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
    }
])

mmwrcase.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
    // Home states and nested views
      .state('home', {
        url:'/',
        views: {
          '': {
            templateUrl: 'partials/home'
          },
          'currentCase@home': {
            templateUrl: 'partials/home/currentCase',
            controller:'currentCaseCtrl'
          },
          'previousCase@home': {
            templateUrl: 'partials/home/previousCase',
            controller:'previousCaseCtrl'
          },
          'leaderBoard@home':{
            templateUrl:'partials/home/leaderBoard',
            controller :'leaderBoardCtrl'
          },
          'leaderBoardSchool@home':{
            templateUrl:'partials/home/leaderBoardSchool',
            controller :'leaderBoardCtrl'
          },
          'linkBox@home': {
            templateUrl: 'partials/home/linkBox',
            controller: 'linkBoxCtrl'
          },
          'upcomingCase@home':{
            templateUrl: 'partials/home/upcomingCase',
            controller:'upcomingCaseCtrl'
          },
          'footer@home':{
            templateUrl:'partials/footer'
          }

        },
        resolve : {
          loggedin :['ngIdentity', function(ngIdentity) {
            return ngIdentity.isAuthenticated();
          }
          ]
        }
      })
      .state('overview', {
        url:'/overview/:caseID',
        templateUrl: 'partials/case/overview',
        controller:'overviewCtrl'
      })
      .state('test', {
        url:'/test/:testType/:caseID',
        templateUrl: 'partials/case/test',
        controller: 'testCtrl'
      })
      .state('results', {
        url:'/results/:caseID',
        templateUrl: 'partials/case/results',
        controller:'resultsCtrl',
        params : {testType: null, questionID : null, selectedAnswerID : null}
      })
      .state('abstract', {
        url:'/abstract/:caseID',
        templateUrl: 'partials/case/abstract',
        controller: 'abstractCtrl'
      })
      .state('additionalInfo', {
        url:'/additionalInfo/:caseID',
        templateUrl: 'partials/case/additionalInfo',
        controller: 'additionalInfoCtrl'
      })
      .state('admin', {
        url:'/admin/users',
        templateUrl : 'partials/admin',
        controller  : 'adminCtrl',
        resolve : stateRoleChecks.isAdmin
      })
      .state('dashboard', {
        url:'/admin/dashboard',
        templateUrl : 'partials/dashboard',
        controller  : 'dashboardCtrl',
        resolve : stateRoleChecks.isAuthor
      })
      .state('editcase', {
        url:'/admin/editcase/:caseID',
        templateUrl : 'partials/authoring/editCase',
        controller  : 'editCaseCtrl',
        resolve : stateRoleChecks.isAuthor
      })
      .state('preview', {
        url:'/preview/:caseID',
        templateUrl: 'partials/case/overview',
        controller:'overviewCtrl',
        params : {
          preview:true,
        }
      })
      .state('previewTest', {
        url:'/preview/test/:testType/:caseID',
        templateUrl: 'partials/case/test',
        controller:'testCtrl',
        params : {
          preview:true,
        }
      })
      .state('previewResults', {
      url:'/preview/results/:caseID',
      templateUrl: 'partials/case/results',
      controller:'resultsCtrl',
      params : {testType: null, questionID : null, selectedAnswerID : null, preview:true}
      })
      .state('previewAbstract', {
      url:'/preview/abstract/:caseID',
      templateUrl: 'partials/case/abstract',
      controller: 'abstractCtrl',
      params : {
          preview:true,
        }
      })
      .state('previewAdditionalInfo', {
      url:'/preview/additionalInfo/:caseID',
      templateUrl: 'partials/case/additionalInfo',
      controller: 'additionalInfoCtrl',
      params : {
          preview:true,
        }
      })
}]);
mmwrcase.run(['$rootScope','$state','$stateParams','$location','ngIdentity',function($rootScope,$state,$stateParams,$location,ngIdentity) {
  $rootScope.$on('$stateChangeStart', function (evt, toState, toStateParams) {
      $rootScope.identity = ngIdentity;
      $rootScope.toState = toState;
      $rootScope.toStateParams = toStateParams;
     if (ngIdentity.isAuthenticated()) {
         console.log(ngIdentity.currentUser);
     }
  })
}]);