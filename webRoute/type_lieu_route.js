const express = require('express');
const router  = express.Router();
const type_auth_controller =require('../webController/type_lieu_controller');
const authenticate =require('../MiddleWares/Authenticate')

router.get('/',type_auth_controller.index);
router.post('/store',type_auth_controller.store);
router.post('/show',type_auth_controller.show);
router.post('/update',type_auth_controller.update);
router.post('/destroy',type_auth_controller.destroy);
module.exports =router