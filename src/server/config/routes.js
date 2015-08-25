//references to controllers go here
var index = require('../controllers/index');
var mmwrCase = require('../controllers/mmwrcase');
// var users = require('../controllers/users');
// var auth = require('./auth');
// var mongoose = require('mongoose'),
//     User = mongoose.model('User');



module.exports = function(app) {

  // app.get('/api/users', auth.requiresRole('admin'), users.getUsers);
  // app.post('/api/users', users.createUser);
  // app.put('/api/users', users.updateUser);
  app.get('/api/mmwrcase/currentCase/',mmwrCase.getCurrentCase);
  app.get('/api/mmwrcase/getCasesByStatus/:devStatus/:displayStatus',mmwrCase.getCasesByStatus);
  app.get('/api/mmwrcase/getCaseById/:caseId',mmwrCase.getCaseById);
  app.get('/api/mmwrcase/getAllAvailCases/',mmwrCase.getAllAvailCases);
  app.post('/api/mmwrcase/createCase',mmwrCase.createCase);
  app.post('/api/mmwrcase/updateCase',mmwrCase.updateCase);
  app.get('/partials/*', function(req, res) {
    res.render('../../public/app/views/' + req.params);
  });

  // app.post('/login', auth.authenticate);

  // app.post('/logout', function(req, res) {
  //   req.logout();
  //   res.end();
  // });

  app.all('/api/*', function(req, res) {
    res.send(404);
  });

  //catchall for everything not defined above
  app.get('/*', index.index);
}