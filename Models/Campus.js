const mongoose  = require('mongoose');
const Schema = mongoose.Schema;
const campusSchema = new Schema({
    intitule:{
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
  
    
     
},{timestamps:true}
);
const campus = mongoose.model('campus',campusSchema);
module.exports =campus;