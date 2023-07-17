const express = require('express');
const router  = express.Router();
const upload =require('../MiddleWares/epreuve')
const epreuvecontroller =require('../Controllers/epreuveController');

router.get('/',epreuvecontroller.index);
router.post('/register',upload.single('doc'),epreuvecontroller.register);
router.get('/:filiere/:niveau/:semestre',epreuvecontroller.getEpreuve);
router.post('/update',upload.single('doc'),epreuvecontroller.update);
router.post('/destroy',epreuvecontroller.destroy);
module.exports =router