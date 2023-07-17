const FavoriesPlace=require('../Models/favorieplace')
const Lieu=require('../Models/lieu')

const User = require('../Models/user');
const bcrypt =require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const favorieplace = require('../Models/favorieplace');

const index = (req,res,next)=>{
    User.find()
    .then(response =>{
        res.json({
            response
        })
    })
    .catch(error =>{
        res.json({
            message:error
        })
    })
    }

const register= (req,res,next)=>{
  
    bcrypt.hash(req.body.password,10,function(err,hashedPass){
       
        let data = new User({
            userName:req.body.userName,
            email:req.body.email,
             phone:req.body.phone, 
            birthDay:req.body.birthDay,
            avatar:req.body.avatar,
            password:hashedPass,
            address:req.body.address,
            sexe:req.body.sexe,
            departement:"",
            faculte:"",
            filiere:""
        });
        if(req.file){
            data.avatar = req.file.path
          //  var img = fs.readFileSync(user.avatar);
           // user.avatar =img.toString('base64');
            

        }
       

        data.save().then(us =>{

            res.status(200).json({
                message:"utilisateur creer avec succes",us
            });
           
          
        }).catch(error=>{
               res.status(500).json({
                   error:error.message,
               })
        });

    });
    
}
const  login =(req,res,next)=>{
    var userName= req.body.userName;
    var password = req.body.password;
    User.findOne({$or:[{email:userName},{phone:userName}]})
    .exec((err,user)=>{
        console.log(user);
            if(user){
                bcrypt.compare(password,user.password,function(err,result){
                    if(err){
                        res.status(500).send({
                           error:err,
                       });
                    }
                    if(result){
                        let token =jwt.sign({name:user.userName},'09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611',{expiresIn:'1h'})
                        res.status(200).send({
                            message:"connexion reussie",
                            token,
                            user
                            
                        })
                    }else{
                        
                        res.status(404).send({
                            massage:"mot de passe incorecte"
                        })
                    }
        
                });
            }else{
                res.status(404).send({
                    message:"utilisateur non existant"
                })
            }
    
    })
}
const show =(req,res,next)=>{
    let userID= req.body.userID
   let user={};
    var favs=[];
  
console.log(req.body.userID);
    User.findById(userID)
    .then(response =>{
        user=response
        
    favorieplace.find().where('user_id').equals(response._id).exec((err,fav)=>{
        if(err){
            res.status(500).send({
                message:err
            });
        }
        if(fav){
           // console.log(user+fav);
            res.json({
                user:user,
                favs:fav
            });
        }
    });
   })
    .catch(error =>{
        res.json({
            message:'une erreur est survenu!'+error
        })
    })
    }
    const magration=(req,res,next) =>{
        User.find()
        .then(response =>{
            
            User.updateMany({},{$set:{filiere:"",niveau:""}})
            .then(response =>{
               // fs.writeFileSync(req.file.path,'base64')
               
                res.json({
                    message:'migration effectuer avec success',
              });
            })
            .catch(error =>{
               res.json({
                   message:'une erreur est survenu lors de la modification de votre compte'
               });
            

        })
        .catch(error =>{
            res.json({
                message:error
            })
        })

    })}
    const update =(req,res,next) =>{
        
        console.log(req.body.userID);
        let updateData={
            userID:req.body.userID,
            userName:req.body.userName,
            email:req.body.email,
             phone:req.body.phone, 
            birthDay:req.body.birthDay,
            avatar:req.body.avatar,
            address:req.body.address,
            sexe:req.body.sexe,
            departement:req.body.departement,
            faculte:req.body.faculte,
            filiere:req.body.filiere,
            niveau:req.body.niveau
            
        };
        if(req.file){
            updateData.avatar = req.file.path
            User.findById(updateData.userID).then(user=>{
                console.log(user);
                fs.unlink(user.avatar, (err) => {
                    if (err) {
                    console.error(err)
                    
                    }});
          });

        }else if(updateData.avatar===null){
            updateData.avatar="";
        }
   User.findByIdAndUpdate(updateData.userID,{$set:updateData})
    .then(response =>{
       // fs.writeFileSync(req.file.path,'base64')
       
        res.json({
            message:'modification effectuer avec success',
      });
    })
    .catch(error =>{
       res.json({
           message:'une erreur est survenu lors de la modification de votre compte'
       });
    })
    }
   
    const destroy =(req,res,next)=>{
        var path ='';
        let userID= req.body.userID
        console.log(userID);
        User.findById(userID).then(user=>{
            console.log(user);
            if(user.avatar===null){
                user.avatar="";
            }
            fs.unlink(user.avatar, (err) => {
                if (err) {
                console.error(err)
                
                }});
 User.findByIdAndDelete(userID)
        .then(response =>{
           res.json({
                message:'employe supprimer   avec succes',
          });
        })
        .catch(error =>{
           res.json({
               message:`une erreur est survenu lors de la suppression de l employe ${error}`
           })
        })
        });
        }
module.exports ={
    register,login,index,show,update,destroy,magration
}
