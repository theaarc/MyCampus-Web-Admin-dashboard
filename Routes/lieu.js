const express = require('express');
const router = express.Router();
const Controller =require('../Controllers/lieuControleur');
const upload =require('../MiddleWares/uploadsLieu')
router.get('/',Controller.index);
router.post('/show',Controller.show);
router.post('/store',upload.array('image[]'), Controller.store);//upload.single('avatar')
router.post('/update',Controller.update);
router.post('/destroy',Controller.destroy);
module.exports=router;