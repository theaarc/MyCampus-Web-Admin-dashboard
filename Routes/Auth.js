const express = require('express');
const router  = express.Router();
const upload =require('../MiddleWares/uploads')
const AuthController =require('../Controllers/AuthController');
const authenticate =require('../MiddleWares/Authenticate')
router.get('/',AuthController.index);
router.get('/migration',AuthController.magration);
router.post('/register',upload.single('avatar'),AuthController.register);
router.post('/login',AuthController.login);
router.post('/show',AuthController.show);
router.post('/updateWithImage',upload.single('avatar'),AuthController.update);
router.post('/update',upload.single('avatar'),AuthController.update);
router.post('/destroy',AuthController.destroy);
module.exports =router
//,authent