const express = require('express');
const router = express.Router();
const Controller =require('../webController/CampusController');
const upload =require('../MiddleWares/uploadsLieu')
router.get('/',Controller.index);
router.post('/show',Controller.show);
router.post('/store',upload.array('image',6), Controller.store);//upload.single('avatar')
router.post('/update',upload.array('image',6),Controller.update);
router.post('/destroy',Controller.destroy);
module.exports=router;