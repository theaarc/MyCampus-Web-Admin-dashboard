const mongoose  = require('mongoose');
const Schema = mongoose.Schema;
const lieuSchema = new Schema({
    intitule:{
        type:String,    
    },
    id_user:{
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
    image:{
      type:String,
    },
    lat:{
        type:Number
    }
    ,long:{
        type:Number
    },
    rating:{
        type:Number
    },
    niveau:{
        type:String
    },
    batiment:{
        type:String
    },
    numeroPorte : {
        type:Number
    }
  
    
     
},{timestamps:true}
);
const lieu = mongoose.model('lieu',lieuSchema);
module.exports =lieu;