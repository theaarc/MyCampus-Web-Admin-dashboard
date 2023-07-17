const express = require('express');
const router  = express.Router();
const upload =require('../MiddleWares/upload_annonce')//import corresponding middleware()
const annonce_controller =require('../Controllers/annonce_controller');
const authenticate =require('../MiddleWares/Authenticate')

router.get('/',annonce_controller.index);
router.post('/show',annonce_controller.show);
router.post('/store',upload.array('document',6),annonce_controller.store);
router.post('/update',upload.array('document',6),annonce_controller.update);//include methode for chaging images
router.post('/destroy',annonce_controller.destroy);
router.post('/minsup',annonce_controller.ByMinsup);
router.get('/universite',annonce_controller.ByUniversite);
router.get('/doyen/:idfac',annonce_controller.ByFaculte);
router.get('/recteur/',annonce_controller.ByRecteur);//include methode for chaging images
router.get('/filiere/:idfiliere',annonce_controller.ByFiliere);

module.exports =router