const express = require('express');
const router  = express.Router();
const upload =require('../MiddleWares/autoriteUploads')
const AuthController =require('../webController/autoriteController');
const authenticate =require('../MiddleWares/Authenticate')
router.get('/',AuthController.index);
router.post('/register',upload.single('avatar'),AuthController.register);
router.post('/login',AuthController.login);
router.get('/show',AuthController.show);
router.post('/update',upload.single('avatar'),AuthController.update);
router.post('/updateAdmin',upload.single('avatar'),AuthController.updateAdmin);
router.post('/updateAuth',upload.single('avatar'),AuthController.updateAuth);
router.post('/destroy',AuthController.destroy);
module.exports =router
//,authent