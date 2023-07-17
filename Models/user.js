const mongoose  = require('mongoose');
const Schema = mongoose.Schema;
var  uniqueValidator  = require ('mongoose-unique-validator') ; 
const userSchema = new Schema({
    userName:{
        type:String,
       
    },
    email:{
        type:String,
        unique: true,
        match: /.+\@.+\..+/,
    
    },
     phone:{
        type:String,
         },
    avatar:{
        type:String
    },
    sexe:{
        type:String
    },
    address:{
        type:String
    },
    password:{
        type:String,
        unique: true,
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
    niveau:{
        type:String,
    },
    matricule:{
        type:String,
    },
    typeUser:{
        type:String,
    },
    bio:{
        type:String,       
    },
    fonction:{
        type:String,   
    },
    Profession:{
        type:String,    
    },
     
},{timestamps:true}
);
userSchema.plugin(uniqueValidator);
const User = mongoose.model('user',userSchema);
module.exports = User;