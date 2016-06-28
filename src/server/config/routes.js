//references to controllers go here
var index = require('../controllers/index');
var mmwrCase = require('../controllers/mmwrcase');
var users = require('../controllers/users');

var media = require('../controllers/media');

var auth = require('./auth');


module.exports = function(app) {

  app.get('/api/users', auth.requiresRole('admin'), users.getUsers);
  // app.post('/api/users', users.createUser);
  // app.put('/api/users', users.updateUser);
  app.post('/login', auth.authenticate);
  app.post('/logout', function(req, res) {
    req.logout();
    res.end();
  });
  app.get('/api/mmwrcase/currentCase/',mmwrCase.getCurrentCase);
  app.get('/api/mmwrcase/getCasesByStatus/:devStatus/:displayStatus',mmwrCase.getCasesByStatus);
  app.get('/api/mmwrcase/getCaseById/:caseId',mmwrCase.getCaseById);
  app.get('/api/mmwrcase/getAllAvailCases/',mmwrCase.getAllAvailCases);
  app.get('/api/mmwrcase/checkQuestionExist/:caseId/:questionId',mmwrCase.checkQuestionExist);
  app.get('/api/mmwrcase/checkAnswerExist/:caseId/:questionId/:answerId',mmwrCase.checkAnswerExist);
  app.get('/api/mmwrcase/checkCaseExist/:caseId',mmwrCase.checkCaseExist);
  app.get('/api/mmwrcase/getAnswerStatistic/:caseId/:questionId',mmwrCase.getAnswerStatistic);
  app.get('/api/mmwrcase/getDevStatus',mmwrCase.getDevStatus);
  app.get('/api/mmwrcase/getDisplayStatus',mmwrCase.getDisplayStatus);
  app.get('/api/mmwrcase/getRating/:caseId', mmwrCase.getRating);
  app.get('/api/mmwrcase/getTopRatedCases/:numberToGet', mmwrCase.getTopRatedCases);
  app.get('/api/mmwrcase/getSortOptions/', mmwrCase.getSortOptions);
  app.get('/api/mmwrcase/getCaseRatingStats', mmwrCase.getCaseRatingStats);
  app.get('/api/mmwrcase/getNextCaseId',mmwrCase.getNextCaseId);
  app.get('/api/mmwrcase/getDraftCases',mmwrCase.getDraftCases);
  app.get('/api/mmwrcase/getTopLeaders/:limit',mmwrCase.getTopLeaders);
  app.get('/api/mmwrcase/getTopSchools/:limit',mmwrCase.getTopSchools);
  app.get('/api/mmwrcase/getUserHistory/:userId',mmwrCase.getUserHistory);


// image upload section
  app.post('/api/fileUpload', media.uploadFile);
  app.get('/api/fileUpload/:id', media.getFile);
  app.post('/api/fileUpload/delete', media.deleteFile);
  //app.post('/api/fileUpload/update', media.updateFileChecked);
  
  app.post('/api/mmwrcase/updateHitCounter/:caseId/:questionId/:answerId', mmwrCase.updateHitCounter);
  app.post('/api/mmwrcase/createCase',mmwrCase.createCase);
  app.post('/api/mmwrcase/updateCase',mmwrCase.updateCase);
  app.post('/api/mmwrcase/createQuestionAnswer',mmwrCase.createQuestionAnswer);
  app.post('/api/mmwrcase/createQuestion',mmwrCase.createQuestion);
  app.post('/api/mmwrcase/createAnswer',mmwrCase.createQuestion);
  app.delete('/api/mmwrcase/admin/deleteCase/:caseId', mmwrCase.deleteCase);
  app.post('/api/mmwrcase/updateRating',mmwrCase.updateRating);
  app.post('/api/mmwrcase/testReformatted', mmwrCase.testReformatted);
  app.post('/api/mmwrcase/saveImages', mmwrCase.saveImages);
  app.post('/api/mmwrcase/saveResult',mmwrCase.saveResult);

// registration
  app.post('/api/mmwrcase/createLogin', mmwrCase.createLogin);
  app.get( '/api/mmwrcase/getMasterData',mmwrCase.getMasterData);
  app.get( '/api/mmwrcase/getUserProfile/:userId',mmwrCase.getUserProfile);
  app.post('/api/mmwrcase/updateUserProfile', mmwrCase.updateUserProfile);
  app.get('/partials/*', function(req, res) {
    res.render('../../public/app/views/' + req.params);
  });

 

  app.all('/api/*', function(req, res) {
    res.send(404);
  });

  //catchall for everything not defined above
  app.get('/*', index.index);
}