const express = require('express');
const router  = express.Router();
const filiere =require('../webController/filiere_controller');
const upload =require('../MiddleWares/filiereupload')
router.get('/',filiere.index);
router.get('/api',filiere.get);
router.post('/store',upload.array('image[]'),filiere.store);
router.post('/show',filiere.show);
router.post('/update',upload.array('image[]'),filiere.update);
router.post('/destroy',filiere.destroy);
module.exports =router