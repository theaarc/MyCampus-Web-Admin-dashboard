const mongoose =require('mongoose')
const fs = require('fs')
const mongodb = require('mongodb');

const Lieu=require('../Models/lieu')
const TypeLieu = require('../Models/typelieu')

const Campus = require('../Models/Campus');
const TypeAutiorite = require('../Models/typeUser');

//voir la liste des employes
const index = (req,res,next)=>{
    if (!req.session.user) {
        return res.redirect('/login');
      }else{
        var i = 0;
        var j = 0; 
        const objectId = mongodb.ObjectId('62a1e0131c39d32efcdbdb55');

        Lieu.find()
        .then(lieux =>{

            lieux.forEach(async lieu=>{

                if(!(lieu.id_type == '' || lieu.id_type === undefined)){
                    if(!(lieu.batiment == '' || lieu.batiment === undefined)){

                        const [dataA, dataB, dataC] = await Promise.all([
                            Campus.findOne({_id:lieu.id_campus}),
                            TypeLieu.findOne({_id:lieu.id_type}),
                            Lieu.findOne({_id:lieu.batiment})
                        ]);

                        lieu.id_campus = JSON.stringify({
                            intitule:dataA.intitule,
                            id:dataA._id
                        });

                        lieu.id_type = JSON.stringify({
                            intitule:dataB.intitule,
                            id:dataB._id
                        });

                        lieu.batiment = JSON.stringify({
                            intitule:dataC.intitule,
                            id:dataC._id
                        })
                        
                        j++; 
                        if(j == lieux.length){
                            Campus.find().then(facultes =>{
                                Lieu.findById('62a1e0131c39d32efcdbdb55')
                                .then(departement => {
                                    Lieu.find({_id:objectId })
                                    .then(batiment =>{
                                        TypeAutiorite.find().then(typesA =>{
                                            TypeLieu.find().then(typesL =>{
                                                req.session.user =  {annonces:req.session.user.annonces,departement:departement,lieux :lieux,user: req.session.user.user,facultes:facultes,typeL:typesL,type:typesA,batiment:batiment}; 
                                                res.render('lieu', req.session.user)
                                            }).catch(error =>{
                                                res.render("error404",{message:"Page not found"})
                                            })
                                        }).catch(error =>{
                                            res.render("error404",{message:"Page not found"})
                                        })
                                    }).catch(error =>{
                                        res.render("error404",{message:"Page not found"})
                                    })
                                }).catch(error =>{
                                    res.render("error404",{message:"Page not found"})
                                })
                            }).catch(error =>{
                                res.render("error404",{message:"Page not found"})
                            })
                        }
                    }else{
                        const [dataA, dataB] = await Promise.all([
                            Campus.findOne({_id:lieu.id_campus}),
                            TypeLieu.findOne({_id:lieu.id_type})
                        ]);

                        lieu.id_campus = JSON.stringify({
                            intitule:dataA.intitule,
                            id:dataA._id
                        });

                        lieu.id_type = JSON.stringify({
                            intitule:dataB.intitule,
                            id:dataB._id
                        });

                        lieu.batiment = JSON.stringify({
                            intitule:"",
                            id:""
                        })
                        
                        j++; 
                        if(j == lieux.length){
                            Campus.find().then(facultes =>{
                                Lieu.findById('62a1e0131c39d32efcdbdb55')
                                .then(departement => {
                                    Lieu.find({_id:objectId })
                                    .then(batiment =>{
                                        TypeAutiorite.find().then(typesA =>{
                                            TypeLieu.find().then(typesL =>{
                                                req.session.user =  {annonces:req.session.user.annonces,departement:departement,lieux :lieux,user: req.session.user.user,facultes:facultes,typeL:typesL,type:typesA,batiment:batiment}; 
                                                res.render('lieu', req.session.user)
                                            }).catch(error =>{
                                                res.render("error404",{message:"Page not found"})
                                            })
                                        }).catch(error =>{
                                            res.render("error404",{message:"Page not found"})
                                        })
                                    }).catch(error =>{
                                        res.render("error404",{message:"Page not found"})
                                    })
                                }).catch(error =>{
                                    res.render("error404",{message:"Page not found"})
                                })
                            }).catch(error =>{
                                res.render("error404",{message:"Page not found"})
                            })
                        } 
                    }
                }else{
                    if(!(lieu.batiment == '' || lieu.batiment === undefined)){
                        const [dataA, dataC] = await Promise.all([
                            Campus.findOne({_id:lieu.id_campus}),
                            TypeLieu.findOne({_id:lieu.id_type}),
                            Lieu.findOne({_id:lieu.batiment})
                        ]);

                        lieu.id_campus = JSON.stringify({
                            intitule:dataA.intitule,
                            id:dataA._id
                        });

                        lieu.id_type = JSON.stringify({
                            intitule:"none",
                            id:"none"
                        });

                        lieu.batiment = JSON.stringify({
                            intitule:dataC.intitule,
                            id:dataC._id
                        })
                            //console.log(lieu)
                            j++; 
                            if(j == lieux.length){
                                Campus.find().then(facultes =>{
                                    Lieu.find({id_type:'6242d1d43d78410e3805cfa7'})
                                    .then(departement => {
                                        Lieu.findById('62a1e0131c39d32efcdbdb55')
                                        .then(batiment =>{
                                            TypeAutiorite.find().then(typesA =>{
                                                TypeLieu.find().then(typesL =>{
                                                    req.session.user =  {annonces:req.session.user.annonces,departement:departement,lieux :lieux,user: req.session.user.user,facultes:facultes,typeL:typesL,type:typesA,batiment:batiment}; 
                                                    res.render('lieu', req.session.user)
                                                }).catch(error =>{
                                                    res.render("error404",{message:"Page not found"})
                                                })
                                            }).catch(error =>{
                                                res.render("error404",{message:"Page not found"})
                                            })
                                        }).catch(error =>{
                                            res.render("error404",{message:"Page not found"})
                                        })
                                    }).catch(error =>{
                                        res.render("error404",{message:"Page not found"})
                                    })
                                }).catch(error =>{
                                    res.render("error404",{message:"Page not found"})
                                })
                            }
                    }else{
                        Campus.findOne({_id:lieu.id_campus})
                        .then(faculte=>{
                            lieu.id_campus = JSON.stringify({
                                intitule:faculte.intitule,
                                id:faculte._id
                            });
                            
                            //console.log(lieu.id_type);
                            lieu.id_type = JSON.stringify({
                                intitule:'none',
                                id:'none'
                            });

                            lieu.batiment = JSON.stringify({
                                intitule:"",
                                id:""
                            })
        
                            //console.log(lieu)
                            j++; 
                            if(j == lieux.length){
                                Campus.find().then(facultes =>{
                                    Lieu.find({id_type:'6242d1d43d78410e3805cfa7'})
                                    .then(departement => {
                                        Lieu.findById('62a1e0131c39d32efcdbdb55')
                                        .then(batiment =>{
                                            TypeAutiorite.find().then(typesA =>{
                                                TypeLieu.find().then(typesL =>{
                                                    req.session.user =  {annonces:req.session.user.annonces,departement:departement,lieux :lieux,user: req.session.user.user,facultes:facultes,typeL:typesL,type:typesA,batiment:batiment}; 
                                                    res.render('lieu', req.session.user)
                                                }).catch(error =>{
                                                    res.render("error404",{message:"Page not found"})
                                                })
                                            }).catch(error =>{
                                                res.render("error404",{message:"Page not found"})
                                            })
                                        }).catch(error =>{
                                            res.render("error404",{message:"Page not found"})
                                        })
                                    }).catch(error =>{
                                        res.render("error404",{message:"Page not found"})
                                    })
                                }).catch(error =>{
                                    res.render("error404",{message:"Page not found"})
                                })
                            }
                        })
                    }
                }
            })
        })
        .catch(error =>{
            res.render('error404',{message:'something went wrong'})
        })
      }  
}
//rechercher un employe par son id
const show =(req,res,next)=>{
    let LieuID =req.body.LieuID
    Lieu.findById(LieuID
        )
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
    //add employer

const store =(req,res,next)=>{
    let lieu= new Lieu({
        intitule:req.body.intitule,
        //id_user:req.body.id_user,
        description:req.body.description,
        image:req.body.image,
        lat:req.body.lat,
        long:req.body.long,
        //rating:req.body.rating,
        id_campus:req.body.id_campus,
        id_type:req.body.id_type,
        batiment:req.body.batiment,
        niveau:req.body.niveau,
        numeroPorte:req.body.numeroPorte
       
    })
    if(req.files){
        let path ='';
        req.files.forEach(function(files,index,array) {
            path =path +files.path +',';
        });
        path =path.substring(0,path.lastIndexOf(","))
        lieu.image = path;
    }
 
    lieu.save()
        .then(response =>{
            //console.log(response);
            res.send('Enregistre avec success');
        })
       .catch(error =>{
            res.render('error404',{message:'something went wrong'})
       })
}

// modifier un employer
const update =(req,res,next) =>{
    var image="";
    var imageString = req.body.imageString;
    var replaceImage = req.body.replaceImage;
    var imgS;
    var LieuID =req.body.LieuID;
    
    let updateData={
        intitule:req.body.intitule,
        description:req.body.description,
        lat:req.body.lat,
        long:req.body.long,
        id_campus:req.body.id_campus,
        id_type:req.body.id_type,
        batiment:req.body.batiment,
        niveau:req.body.niveau,
        numeroPorte:req.body.numeroPorte
    }

    let tabimage = imageString.split(',');
    let tabreplace = replaceImage.split(',');

    imgS = imageString;

    for (let i = 0; i < tabreplace.length; i++) {
        if(tabreplace[i] == 'r'){
            fs.unlink(tabimage[i], (err) => {
                if (err) {
                    console.error(err)
                }
            });
            if(i == 0){
                imgS = replaceImage.replace(tabreplace[i]+',',"");
            }else{
                imgS = replaceImage.replace(','+tabreplace[i],"");
            }
        }
    }

    //console.log("end string : "+imgS);

    if(req.files){
        let path ='';
        req.files.forEach(function(files,index,array) {
            path =path +files.path +',';
        });
        path =path.substring(0,path.lastIndexOf(","))
        imgS = imgS +","+ path;      

        //imgS =imgS.substring(0,imgS.lastIndexOf(","))
    }

    updateData.image = imgS;
    
    Lieu.findByIdAndUpdate(LieuID,{$set:updateData})
    .then(response =>{
        res.send('Enregistre avec success');
    })
    .catch(error =>{
        res.render('error404',{message:'something went wrong'});
    })
}

updateimage=(req,res,next)=>{
    let LieuID=req.body.LieuID;
    var path ='';
    Lieu.findById(req.body.LieuID)
    .then(response =>{
        path =response.image.split(',')});
}
   
const destroy =(req,res,next)=>{
    var path ='';
    let LieuID=req.body.LieuID
    Lieu.findById(req.body.LieuID)
    .then(response =>{
        
        path =response.image.split(',')

        Lieu.findByIdAndRemove(LieuID)
        .then(response =>{
  
            path.forEach(path=>{
                fs.unlink(path, (err) => {
                    if (err) {
                        console.error(err)
                    }
                });
            })
            res.json('Enregistre avec success');
        })
        .catch(error =>{
            res.render('error404',{message:'something went wrong'});
        })    
    })
    .catch(error =>{
        res.render('error404',{message:'something went wrong'});
    })
}
module.exports={
    index,destroy,show,store,update
}
