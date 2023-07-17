const express = require('express');
const router  = express.Router();
const upload =require('../MiddleWares/upload_annonce')//import corresponding middleware()
const annonce_controller =require('../webController/annonce_controller');
const authenticate =require('../MiddleWares/Authenticate')

router.get('/',annonce_controller.index);
router.get('/dahsbordadmin',annonce_controller.dahsbordadmin);
router.post('/show',annonce_controller.show);

router.get('/annoncebyAutorite/:state',annonce_controller.annoncebyAutorite);
router.get('/annonceBystate/:state',annonce_controller.annonceBystate);
router.post('/store',upload.array('document',6),annonce_controller.store);
router.post('/update',upload.array('document',6),annonce_controller.update);//include methode for chaging images
router.post('/destroy',annonce_controller.destroy);
router.post('/minsup',annonce_controller.ByMinsup);
router.post('/universite',annonce_controller.ByAllUniversite);
router.post('/faculte',annonce_controller.ByFaculte);
router.post('/departement',annonce_controller.ByDepartement);
router.post('/filiere',annonce_controller.ByFiliere);
router.post('/byID',annonce_controller.ByIdAnnonceur);

router.post('/test',annonce_controller.ByAllUniversite);
router.get('/facultes',annonce_controller.ByAllFaculte);

router.post('/validate',annonce_controller.validate);
router.post('/rejeter',annonce_controller.rejeter);

module.exports =router