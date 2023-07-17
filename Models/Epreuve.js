const mongoose  = require('mongoose');
const Schema = mongoose.Schema;
var  uniqueValidator  = require ('mongoose-unique-validator') ; 
const epreuveSchema = new Schema({
    intitule:{
        type:String
       
    },
    nivau:{
        type:String
         }, 
   
    doc:{
        type:String
    },
    type:{
        type:String
    },
    annee:{
        type:String
    },
 faculte:{
        type:String,
    },
    departement:{
        type:String,
    },
    filiere:{
        type:String,
    },
    semestre:{
        type:String,
    },
     
},{timestamps:true}
);
epreuveSchema.plugin(uniqueValidator);
const Epreuve = mongoose.model('epreuve',epreuveSchema);
module.exports =Epreuve;