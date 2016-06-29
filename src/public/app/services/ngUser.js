angular.module('app').factory('ngUser', function($resource) {
  var UserResource = $resource('/api/users/:id', {_id: "@id"}, {
    update: {method:'PUT',isArray:false}
  });

  UserResource.prototype.isAdmin = function() {
    return this.type && this.type.indexOf('admin') > -1;
  };
  UserResource.prototype.isAuthor = function() {
    return this.type && this.type.indexOf('author') > -1;
  }

  return UserResource;
});