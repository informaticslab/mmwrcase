angular.module('app').factory('ngCase', function($http,dialogs,$window, $state) {
	return {
		getCasesByStatus: function(developmentStatus,displayStatus) {
			return $http.get('/api/mmwrcase/getCasesByStatus/'+developmentStatus+'/'+displayStatus);
		},
		getAllAvailCases: function() {
			return $http.get('/api/mmwrcase/getAllAvailCases/');
		},
		getCurrentCase: function() {
			return $http.get('/api/mmwrcase/currentCase/');
		},
		getCaseById: function(caseId) {
			return $http.get('/api/mmwrcase/getCaseById/'+caseId);
		},
		getDevStatus : function() {
			return $http.get('/api/mmwrcase/getDevStatus/');
		},
		getDisplayStatus : function() {
			return $http.get('/api/mmwrcase/getDisplayStatus/');
		},
		getAnswerStats : function(caseId,questionId) {
			return $http.get('/api/mmwrcase/getAnswerStatistic/'+caseId+'/'+questionId);
		},
		updateHitCounter : function(caseId,questionId,answerId) {
			return $http.post('/api/mmwrcase/updateHitCounter/'+caseId+'/'+questionId+'/'+answerId);
		},
		getTopRateCases : function(number) {
			return $http.get('/api/mmwrcase/getTopRatedCases/'+number);
		},
		getSortOptions : function() {
			return $http.get('/api/mmwrcase/getSortOptions/');
		},
		getCaseRatingStats : function() {
			return $http.get('/api/mmwrcase/getCaseRatingStats');
		},
		getDraftCases : function() {
			return $http.get('/api/mmwrcase/getDraftCases');
		},
		getRating : function(caseId) {
			return $http.get('api/mmwrcase/getRating/'+caseId);
		},
		exitMode : function(preview) {
			if (preview) {
				var dlg = dialogs.confirm('Confirm Close','Please confirm that you are done with previewing the case');
				dlg.result.then(function(btn){
					$window.close();
				}, function(btn){
					//No
				});
			}
			else {
				var dlg = dialogs.confirm();
				dlg.result.then(function(btn){
					$state.go('home');
				}, function(btn){
				//No
				});	
			}	
		}
	}

});