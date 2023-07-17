const FavoriesPlace=require('../Models/favorieplace')
const Lieu=require('../Models/lieu')

const User = require('../Models/user');
const Fac = require('../Models/Campus');

const bcrypt =require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const favorieplace = require('../Models/favorieplace');
const Annonce = require('../Models/annonce');
const Autorite = require('../Models/autorite');
const Campus = require('../Models/Campus');
const TypeUser = require('../Models/typeUser');
const Filiere = require('../Models/filiere');

const Type_annonce = require('../Models/typeAnnonce');

const index = (req,res,next)=>{
    if (!req.session.user) {
        return res.redirect('/login');
      }
    var i =0,j=0,k=0,l=0;

    User.find()
        .then(users =>{
                    if (users.length==0) {
                        Campus.find().then(facultes =>{
                            Lieu.find({id_type:'6242d1d43d78410e3805cfa7'})
                            .then(departement => {
                                TypeAutiorite.find().then(typesA =>{
                                    res.render("user", {users:[],annonces:req.session.user.annonces,user:req.session.user.user,departement:departement,facultes:facultes,typesUser:typesA})
                                }).catch(error =>{
                                    res.render("error404",{message:"Page not found"})
                                })
                            })
                        }).catch(error =>{
                            res.render("error404",{message:"Page not found"})
                        })
                    }
                    /*****************if user table is not empty**************************** */
                    users.forEach(async user=>{
                        if(!((user.faculte == "" || user.faculte === undefined) && (user.departement == "" || user.departement === undefined))){
                            if(user.departement == "" || user.departement === undefined){
                                const [dataA1] = await Promise.all([
                                    Campus.findOne({_id:user.faculte})
                                ]);

                                user.faculte = JSON.stringify({
                                    intitule:dataA1.intitule,
                                    id:dataA1._id
                                });

                                user.departement = JSON.stringify({
                                    intitule:'none',
                                    id:''
                                });

                            }else if(user.faculte == "" || user.faculte === undefined){
                                const [dataB1] = await Promise.all([
                                    Lieu.findOne({_id:user.departement})
                                ]);
                    
                                user.faculte = JSON.stringify({
                                    intitule:'none',
                                    id:''
                                });
                    
                                user.departement = JSON.stringify({
                                    intitule:dataB1.intitule,
                                    id:dataB1._id
                                });  
                            }else{
                                const [dataA, dataB] = await Promise.all([
                                    Campus.findOne({_id:user.faculte}),
                                    Lieu.findOne({_id:user.departement})
                                ]);
                    
                                user.faculte = JSON.stringify({
                                    intitule:dataA.intitule,
                                    id:dataA._id
                                });
                    
                                user.departement = JSON.stringify({
                                    intitule:dataB.intitule,
                                    id:dataB._id
                                });
                            }
                            j++;
                            if(j==users.length){
                                //finding faculty and departement per faculty
                                Campus.find().then(facultes =>{
                                    Lieu.find({id_type:'6242d1d43d78410e3805cfa7'})
                                    .then(departement => {
                                        TypeUser.find().then(typesU =>{
                                            console.log(typesU)
                                            res.render("user", {users:users,annonces:req.session.user.annonces,user:req.session.user.user,departement:departement,facultes:facultes,typesUser:typesU})
                                        }).catch(error =>{
                                            res.render("error404",{message:"Page not found"})
                                        })
                                    })
                                }).catch(error =>{
                                    res.render("error404",{message:"Page not found"})
                                })
                             }
                        }else{
                            user.faculte = JSON.stringify({
                                intitule:'none',
                                id:''
                            });
                
                            user.departement = JSON.stringify({
                                intitule:'none',
                                id:''
                            });
                            j++;
                            if(j==users.length){
                                //finding faculty and departement per faculty
                                Campus.find().then(facultes =>{
                                    Lieu.find({id_type:'6242d1d43d78410e3805cfa7'})
                                    .then(departement => {                                   
                                        TypeUser.find().then(typesU =>{
                                            console.log(typesU)
                                            res.render("user", {users:users,annonces:req.session.user.annonces,user:req.session.user.user,departement:departement,facultes:facultes,typesUser:typesU})
                                        }).catch(error =>{
                                            res.render("error404",{message:"Page not found"})
                                        })
                                    });
                                }).catch(error =>{
                                    res.render("error404",{message:"Page not found"})
                                })
                            }
                        }
                    });
        })
        .catch(error =>{
            res.render("error404",{message:"Page not found"})
        })
            
}

const register=(req,res,next)=>{
    bcrypt.hash(req.body.password,10,function(err,hashedPass){
        if(err){
            res.json({
                error:err
            });
        }
        let user = new User({
            userName:req.body.userName,
            email:req.body.email,
            phone:req.body.phone, 
            birthDay:req.body.birthday,
            password:hashedPass,
            address:req.body.address,
            sexe:req.body.sexe,
            faculte:req.body.faculte,
            departement : req.body.departement,
            
        });
        if(req.file){
            user.avatar = req.file.path
        }else{
            user.avatar = 'none' 
        }
        user.save().then(user =>{
            res.send('Enregistre avec success');
        }).catch(error=>{
            res.render('error404',{message:'something went wrong'})
        });

    });
    
}

const  login =(req,res,next)=>{
    var email= req.body.email;
    var password = req.body.password;

    User.findOne({email:email})
    .exec((err,user)=>{
       
            if(user){
                bcrypt.compare(password,user.password,async function(err,result){
                    if(err){
                        res.json({
                            error:err,
                        }); 
                    }
                    if(result){

                        const [dataA, dataB, dataC] = await Promise.all([
                            Campus.findOne({_id:user.faculte}),
                            Lieu.findOne({_id:user.departement}),
                            TypeUser.findOne({_id:user.typeUser})
                        ]);
    
                        user.faculte = JSON.stringify({
                            intitule:dataA==null?"":dataA.intitule,
                            id:dataA==null?"":dataA._id
                        });
        
                        user.departement = JSON.stringify({
                            intitule:dataB==null?"": dataB.intitule,
                            id:dataB==null?"": dataB._id
                        });
        
                        user.typeUser = JSON.stringify({
                            intitule:dataC==null?"":dataC.type_user,
                            id:dataC==null?"":dataC._id
                        });

                        if(req.body.denomination == 'admin'){
                            var i =0;
                            Annonce.find()
                            .then(async response =>{
                                var filiere= await Filiere.find();
                                response.forEach(annonce=>{
                                    User.findOne({_id:annonce.id_annoncer})
                                    .then(auth =>{
                                            i++;
                                            annonce.id_annoncer=JSON.stringify({
                                                Profession:auth.Profession,
                                                name:auth.userName,
                                                id:auth._id,
                                                avatar:auth.avatar
                                            }); 
                                        
                                        if(i==response.length){
                                            Campus.find().then(facultes =>{
                                                Lieu.find({id_type:'6242d1d43d78410e3805cfa7'})
                                                .then(departement => {
                                                    TypeUser.find().then(typesU =>{
                                                        req.session.user={user:user, annonces:response,departement:departement,facultes:facultes,type:typesU,filiere:filiere};  
                                                        //console.log(facultes)
                                                        //req.session.user={user:autorite, annonces:response,departement:departement,facultes:facultes,type:typesA};  
                                                        res.render('sidemenuHome', req.session.user)
                                                    }).catch(error =>{
                                                        res.render("error404",{message:"Page not found"})
                                                    })
                                                })
                                            }).catch(error =>{
                                                res.render("error404",{message:"Page not found"})
                                            }) 
                                        }  
                                    })
    
                                })       
                            })
                            .catch(error =>{
                                res.render('error404',{message:'something went wrong'})
                            })
                        }else if(req.body.denomination == 'auth'){
                                            
                            var type_annonce;
    
                            Type_annonce.find()
                            .then(response =>{
                                type_annonce = response;
                            })
    
                            Annonce.find({id_annoncer:user._id})
                            .then(response =>{
                                Campus.find().then(facultes =>{
                                    Lieu.find({id_type:'6242d1d43d78410e3805cfa7'})
                                    .then(departement => {
                                        TypeUser.find().then(typesU =>{
                                            req.session.autorite = {autorite:user,annonces:response,departement:departement,facultes:facultes,type:typesU}
                                            res.redirect('/auth');
                                        }).catch(error =>{
                                            res.render("error404",{message:"Page not found"})
                                        })
                                    })
                                }).catch(error =>{
                                    res.render("error404",{message:"Page not found"})
                                }) 
                            })
                        }

                    }else{
                        res.status(404).send({
                            message:"mot de passe incorecte"
                        })
                    }
        
                });
            }else{
                res.status(405).send({
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


const update =(req,res,next) =>{
        
        //console.log(req.body.userID);
        var profile = req.body.profilpic;

        let updateData={
            userID:req.body.userID,
            userName:req.body.userName,
            email:req.body.email,
            phone:req.body.phone, 
            birthDay:req.body.birthDay,
            avatar:req.body.avatar,
            address:req.body.address,
            sexe:req.body.sexe,
            faculte:req.body.faculte,
            departement:'',    
        };

        if(req.file){
            updateData.avatar = req.file.path
            User.findById(updateData.userID).then(user=>{
                //console.log(user);
                if(!(user.avatar === null || user.avatar == 'none')){
                    fs.unlink(user.avatar, (err) => {
                        if (err) {
                            console.error(err)
                        }});
                }
            });

        }else if(updateData.avatar===null){
            updateData.avatar=profile;
         }
   
        User.findByIdAndUpdate(updateData.userID,{$set:updateData})
        .then(response =>{
            res.send('Enregistre avec success');
        })
        .catch(error =>{
            res.render('error404',{message:'something went wrong'})
        })
}
   
const destroy =(req,res,next)=>{
    //var path ='';
        let userID= req.body.userID
        console.log(userID);

        User.findById(userID).then(user=>{

            if(user){
                if(!(user.avatar === null || user.avatar == 'none')){
                    fs.unlink(user.avatar, (err) => {
                        if (err) {
                            console.error(err)
                        }
                    });
                }
            }
            
            User.findByIdAndDelete(userID)
            .then(response =>{
                res.json('Enregistre avec success');
            })
            .catch(error =>{
                res.render('error404',{message:'something went wrong'})
            })
        });
    }
module.exports ={
    register,login,index,show,update,destroy
}
