const mongoose  = require('mongoose');
const Schema = mongoose.Schema;
const filiereSchema = new Schema({
    intitule:{
        type:String,
        
    },
    image:{
        type:String,
      },
    departement:{
        type:String,
        },
        id_type:{
            type:String,
            },
        id_campus:{
            type:String,
            },
        description:{
        type:String,
        
         }, 
    
    
   
  
    
     
},{timestamps:true}
);
const filiere = mongoose.model('filiere',filiereSchema);
module.exports =filiere;