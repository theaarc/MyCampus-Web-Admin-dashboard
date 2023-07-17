const mongoose  = require('mongoose');
const Schema = mongoose.Schema;
var  uniqueValidator  = require ('mongoose-unique-validator') ; 
const typeUserSchema = new Schema({
    
    type_user:{
        type:String,
        unique: true,
},
    num_reference:{
        type:String,
    },

    
},{timestamps:true}
);
typeUserSchema.plugin(uniqueValidator);
const TypeUser = mongoose.model('typeUser',typeUserSchema);
module.exports = TypeUser;