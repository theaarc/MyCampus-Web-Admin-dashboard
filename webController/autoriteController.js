const Type_annonce = require('../Models/typeAnnonce');
const Autorite = require('../Models/autorite');
const bcrypt =require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const Annonce = require('../Models/annonce');

const Campus = require('../Models/Campus');
const TypeUser = require('../Models/typeUser');
const Lieu=require('../Models/lieu');
const Filiere = require('../Models/filiere');

const index = (req,res,next)=>{
    Autorite.find()
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

const register=(req,res,next)=>{
    console.log(req.body.typeA)
    bcrypt.hash(req.body.password,10,function(err,hashedPass){
        if(err){
            res.json({
                error:err
            });
        }
        let autorite = new Autorite({
            Name:req.body.Name,
            email:req.body.email,
            phone:req.body.phone, 
            address:req.body.address,
            birthDay:req.body.birthday,
            fonction:req.body.fonction,
            Profession:req.body.Profession,
            lieudeservice:req.body.lieudeservice,
            password:hashedPass,
            idcampus:req.body.idcampus,
            type:req.body.typeA,
            departement : req.body.departement,
            bio: req.body.bio
        });
        if(req.file){
            autorite.avatar = req.file.path
        }else{
            autorite.avatar = "none"
        }
        autorite.save().then(user =>{
            res.send('Enregistre avec success');
            console.log(user);
        }).catch(error=>{
            res.render('error404',{message:'something went wrong'});
        });

    });
    
}


const  login =(req,res,next)=>{
    var userName= req.body.email;
    var password = req.body.password;

    Autorite.findOne({email:userName})
    .then(async autorite=>{
        
        if(autorite){
            bcrypt.compare(password,autorite.password,async function(err,result){
                if(err){
                   res.json({
                       error:err,
                   }); 
                }
                if(result){
                    const [dataA, dataB, dataC] = await Promise.all([
                        Campus.findOne({_id:autorite.idcampus}),
                        Lieu.findOne({_id:autorite.departement}),
                        TypeUser.findOne({_id:autorite.type})
                    ]);

                    autorite.idcampus = JSON.stringify({
                        intitule:dataA==null?"":dataA.intitule,
                        id:dataA==null?"":dataA._id
                    });
    
                    autorite.departement = JSON.stringify({
                        intitule:dataB==null?"": dataB.intitule,
                        id:dataB==null?"": dataB._id
                    });
    
                    autorite.type = JSON.stringify({
                        intitule:dataC.type_user,
                        id:dataC._id
                    });

                    if(req.body.denomination == 'admin'){
                        var i =0;
                        Annonce.find()
                        .then(async response =>{
                            var filiere= await Filiere.find();
                            response.forEach(annonce=>{
                                Autorite.findOne({_id:annonce.id_annoncer})
                                .then(auth =>{ 
                                        i++;
                                        annonce.id_annoncer=JSON.stringify({
                                            Profession:auth.Profession,
                                            name:auth.Name,
                                            id:auth._id,
                                            avatar:auth.avatar
                                        }); 
                                    
                                    if(i==response.length){
                                        Campus.find().then(facultes =>{
                                            Lieu.find({id_type:'6242d1d43d78410e3805cfa7'})
                                            .then(departement => {
                                                TypeAutiorite.find().then(typesA =>{
                                                    req.session.user={user:autorite, annonces:response,departement:departement,facultes:facultes,type:typesA,filiere:filiere};  
                                                    console.log(facultes)
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

                        Annonce.find({id_annoncer:autorite._id})
                        .then(response =>{
                            Campus.find().then(facultes =>{
                                Lieu.find({id_type:'6242d1d43d78410e3805cfa7'})
                                .then(departement => {
                                    TypeAutiorite.find().then(typesA =>{
                                        req.session.autorite = {autorite:autorite,annonces:response,departement:departement,facultes:facultes,type:typesA}
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
            res.status(404).send({
                message:"utilisateur non existant"
            })
        }
    })
}
const show =(req,res,next)=>{
    let userID= req.body.userID
    Autorite.findById(userID)
    .then(response =>{
        res.json({
            response
        })
    })
    .catch(error =>{
        res.json({
            message:'une erreur est survenu!'
        })
    })
    }
    const update =(req,res,next) =>{
        //console.log(req.body.userID);
        var profile = req.body.profilpic;

        let updateData={
            userID:req.body.userID,
            Name:req.body.userName,
            email:req.body.email,
            phone:req.body.phone, 
            address:req.body.address,
            birthDay:req.body.birthDay,
            fonction:req.body.fonction,
            Profession:req.body.Profession,
            lieudeservice:req.body.lieudeservice,
            idcampus:req.body.faculte,
            departement:req.body.departement,
            type:req.body.type,
            
        };
        if(req.file){
            updateData.avatar = req.file.path
         
            Autorite.findById(updateData.userID).then(user=>{
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

        Autorite.findByIdAndUpdate(updateData.userID,{$set:updateData})
        .then(response =>{
            res.send('Enregistre avec success');
        })
        .catch(error =>{
            res.render('error404',{message:'something went wrong'})
        })
    }

    const updateAdmin =(req,res,next) =>{
        //console.log(req.body.userid);
        var profile = req.body.profile;
        console.log(req.body.password)

        let updateData={
            userID:req.body.userid,
            Name:req.body.username,
            email:req.body.email,
            phone:req.body.phone, 
            address:req.body.address,
            birthDay:req.body.birthday,
            // avatar:req.body.avatar,
            fonction:req.body.fonction,
            Profession:req.body.profession,
            lieudeservice:req.body.lieudeservice,
            idcampus:req.body.faculte,
            departement:req.body.departement,   
        };
        //****************checking for documents submitted********** */
        if(req.file){
            updateData.avatar = req.file.path
            //console.log(updateData.userID)
         
            Autorite.findById(updateData.userID).then(user=>{
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

        /**********************checking for password****************** */
        if(req.body.password != ""){
            bcrypt.hash(req.body.password,10,function(err,hashedPass){
                if(err){
                    console.log("an error occured once crypting this password")
                }
                updateData.password = hashedPass;

                Autorite.findByIdAndUpdate(updateData.userID,{$set:updateData})
                .then(response =>{
                    Autorite.findById(updateData.userID).then(async autorite=>{
                        if(autorite){
                            const [dataA, dataB, dataC] = await Promise.all([
                                Campus.findOne({_id:autorite.idcampus}),
                                Lieu.findOne({_id:autorite.departement}),
                                TypeAutiorite.findOne({_id:autorite.type})
                            ]);
            
                            autorite.idcampus = JSON.stringify({
                                intitule:dataA.intitule,
                                id:dataA._id
                            });
            
                            autorite.departement = JSON.stringify({
                                intitule:dataB.intitule,
                                id:dataB._id
                            });
            
                            autorite.type = JSON.stringify({
                                intitule:dataC.type_user,
                                id:dataC._id
                            });
        
                            var i =0;
                            Annonce.find()
                            .then(response =>{
        
                                response.forEach(annonce=>{
                                    Autorite.findOne({_id:annonce.id_annoncer})
                                    .then(auth =>{ 
                                    i++;
                                            annonce.id_annoncer=JSON.stringify({
                                                Profession:auth.Profession,
                                                name:auth.Name,
                                                id:auth._id,
                                                avatar:auth.avatar
                                            }); 
                                        
                                        if(i==response.length){
                                            Campus.find().then(facultes =>{
                                                Lieu.find({id_type:'6242d1d43d78410e3805cfa7'})
                                                .then(departement => {
                                                    TypeAutiorite.find().then(typesA =>{
                                                        req.session.user={user:autorite, annonces:response,departement:departement,facultes:facultes,type:typesA};
                                                        res.send('Enregistre avec success');  
                                                        //res.render('sidemenuHome', req.session.user)
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
                        }
                        //req.session.user.user = autorite;
                    })
                })
                .catch(error =>{
                    res.render('error404',{message:'something went wrong'})
                })
            })
        }else{
            Autorite.findById(updateData.userID).then(user=>{
                updateData.password = user.password
            })

            Autorite.findByIdAndUpdate(updateData.userID,{$set:updateData})
            .then(response =>{
                Autorite.findById(updateData.userID).then(async autorite=>{
                    if(autorite){
                        const [dataA, dataB, dataC] = await Promise.all([
                            Campus.findOne({_id:autorite.idcampus}),
                            Lieu.findOne({_id:autorite.departement}),
                            TypeAutiorite.findOne({_id:autorite.type})
                        ]);
        
                        autorite.idcampus = JSON.stringify({
                            intitule:dataA.intitule,
                            id:dataA._id
                        });
        
                        autorite.departement = JSON.stringify({
                            intitule:dataB.intitule,
                            id:dataB._id
                        });
        
                        autorite.type = JSON.stringify({
                            intitule:dataC.type_user,
                            id:dataC._id
                        });
    
                        var i =0;
                        Annonce.find()
                        .then(response =>{
    
                            response.forEach(annonce=>{
                                Autorite.findOne({_id:annonce.id_annoncer})
                                .then(auth =>{ 
                                i++;
                                        annonce.id_annoncer=JSON.stringify({
                                            Profession:auth.Profession,
                                            name:auth.Name,
                                            id:auth._id,
                                            avatar:auth.avatar
                                        }); 
                                    
                                    if(i==response.length){
                                        Campus.find().then(facultes =>{
                                            Lieu.find({id_type:'6242d1d43d78410e3805cfa7'})
                                            .then(departement => {
                                                TypeAutiorite.find().then(typesA =>{
                                                    req.session.user={user:autorite, annonces:response,departement:departement,facultes:facultes,type:typesA};
                                                    res.send('Enregistre avec success');  
                                                    //res.render('sidemenuHome', req.session.user)
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
                    }
                    //req.session.user.user = autorite;
                })
            })
            .catch(error =>{
                res.render('error404',{message:'something went wrong'})
            })
        }
    }

    const updateAuth =(req,res,next) =>{
        //console.log(req.body.userid);
        var profile = req.body.profile;
        console.log(req.body.password)

        let updateData={
            userID:req.body.userid,
            Name:req.body.username,
            email:req.body.email,
            phone:req.body.phone, 
            address:req.body.address,
            birthDay:req.body.birthday,
            // avatar:req.body.avatar,
            fonction:req.body.fonction,
            Profession:req.body.profession,
            lieudeservice:req.body.lieudeservice,
            idcampus:req.body.faculte,
            departement:req.body.departement,
            bio:req.body.bio   
        };
        //****************checking for documents submitted********** */
        if(req.file){
            updateData.avatar = req.file.path
            //console.log(updateData.userID)
         
            Autorite.findById(updateData.userID).then(user=>{
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

        /**********************checking for password****************** */
        if(req.body.password != ""){
            bcrypt.hash(req.body.password,10,function(err,hashedPass){
                if(err){
                    console.log("an error occured once crypting this password")
                }
                updateData.password = hashedPass;

                Autorite.findByIdAndUpdate(updateData.userID,{$set:updateData})
                .then(response =>{
                    Autorite.findById(updateData.userID).then(async autorite=>{
                        if(autorite){
                            const [dataA, dataB, dataC] = await Promise.all([
                                Campus.findOne({_id:autorite.idcampus}),
                                Lieu.findOne({_id:autorite.departement}),
                                TypeAutiorite.findOne({_id:autorite.type})
                            ]);
            
                            autorite.idcampus = JSON.stringify({
                                intitule:dataA.intitule,
                                id:dataA._id
                            });
            
                            autorite.departement = JSON.stringify({
                                intitule:dataB.intitule,
                                id:dataB._id
                            });
            
                            autorite.type = JSON.stringify({
                                intitule:dataC.type_user,
                                id:dataC._id
                            });

                            Annonce.find({id_annoncer:autorite._id})
                            .then(response =>{
                                Campus.find().then(facultes =>{
                                    Lieu.find({id_type:'6242d1d43d78410e3805cfa7'})
                                    .then(departement => {
                                        TypeAutiorite.find().then(typesA =>{
                                            req.session.autorite = {autorite:autorite,annonces:response,departement:departement,facultes:facultes,type:typesA}
                                        }).catch(error =>{
                                            res.render("error404",{message:"Page not found"})
                                        })
                                    })
                                }).catch(error =>{
                                    res.render("error404",{message:"Page not found"})
                                }) 
                            })
                        }
                        //req.session.user.user = autorite;
                    })
                })
                .catch(error =>{
                    res.render('error404',{message:'something went wrong'})
                })
            })
        }else{
            Autorite.findById(updateData.userID).then(user=>{
                updateData.password = user.password
            })

            Autorite.findByIdAndUpdate(updateData.userID,{$set:updateData})
            .then(response =>{
                Autorite.findById(updateData.userID).then(async autorite=>{
                    if(autorite){
                        const [dataA, dataB, dataC] = await Promise.all([
                            Campus.findOne({_id:autorite.idcampus}),
                            Lieu.findOne({_id:autorite.departement}),
                            TypeAutiorite.findOne({_id:autorite.type})
                        ]);
        
                        autorite.idcampus = JSON.stringify({
                            intitule:dataA.intitule,
                            id:dataA._id
                        });
        
                        autorite.departement = JSON.stringify({
                            intitule:dataB.intitule,
                            id:dataB._id
                        });
        
                        autorite.type = JSON.stringify({
                            intitule:dataC.type_user,
                            id:dataC._id
                        });
    
                        var i =0;
                        Annonce.find()
                        .then(response =>{
    
                            response.forEach(annonce=>{
                                Autorite.findOne({_id:annonce.id_annoncer})
                                .then(auth =>{ 
                                i++;
                                        annonce.id_annoncer=JSON.stringify({
                                            Profession:auth.Profession,
                                            name:auth.Name,
                                            id:auth._id,
                                            avatar:auth.avatar
                                        }); 
                                    
                                    if(i==response.length){
                                        Campus.find().then(facultes =>{
                                            Lieu.find({id_type:'6242d1d43d78410e3805cfa7'})
                                            .then(departement => {
                                                TypeAutiorite.find().then(typesA =>{
                                                    req.session.autorite={autorite:autorite, annonces:response,departement:departement,facultes:facultes,type:typesA};
                                                    res.send('Enregistre avec success');  
                                                    //res.render('sidemenuHome', req.session.user)
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
                    }
                    //req.session.user.user = autorite;
                })
            })
            .catch(error =>{
                res.render('error404',{message:'something went wrong'})
            })
        }
    }
   
    const destroy =(req,res,next)=>{
     
        let userID= req.body.userID
        console.log(userID);

        Autorite.findById(userID).then(user=>{
            //console.log(user);
            if(user){
                if(!(user.avatar === null || user.avatar == 'none')){
                    fs.unlink(user.avatar, (err) => {
                        if (err) {
                            console.error(err)
                        }
                    });
                }
            }
        });
        
        Autorite.findByIdAndRemove(userID)
        .then(response =>{
            res.json('Enregistre avec success');
        })
        .catch(error =>{
            res.render('error404',{message:'something went wrong'})
        })
    }
module.exports ={
    register,login,index,show,update,updateAdmin,updateAuth,destroy
}