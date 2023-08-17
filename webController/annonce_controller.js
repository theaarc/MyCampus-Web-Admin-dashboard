const Annonce = require('../Models/annonce');
const User = require('../Models/autorite');
const Type_annonce = require('../Models/typeAnnonce');

const bcrypt =require('bcryptjs');
const jwt = require('jsonwebtoken');
const { json } = require('body-parser');
const { userInfo } = require('node:os');
const fs = require('fs');
const { response } = require('express');
const Campus = require('../Models/Campus')
const Filiere = require('../Models/filiere')

const TypeAutiorite = require('../Models/typeUser');
const Lieu=require('../Models/lieu')

const index =   (req,res,next)  =>{
    if (!req.session.user) {
       return res.redirect('/login');
     }else{
        var us = req.session.user.user;
        var i =0;
        Annonce.find()
        .then(response =>{
            console.log("auth1 : "+response)
if (response.length==0) {
    req.session.user =  {annonces :[],user: req.session.user.user} ; 
    res.render('annonce', req.session.user) 
}
        response.forEach(annonce=>{
            User.findOne({_id:annonce.id_annoncer})
            .then(user =>{ 
              i++;

                annonce.id_annoncer=JSON.stringify({
                    Profession:user.Profession,
                    name:user.Name,
                    id:user._id,
                    avatar:user.avatar,
                    type:user.type
                });
               // console.log("auth : "+user)    
                
                if(i==response.length){
                  //  console.log(response)
                  Campus.find().then(facultes =>{
                        Lieu.find({id_type:'6242d1d43d78410e3805cfa7'})
                        .then(departement => {
                            TypeAutiorite.find().then(typesA =>{
                               // console.log(facultes)
                                req.session.user={user:req.session.user.user, annonces:response,departement:departement,facultes:facultes,type:typesA};  
                                res.render('annonce', req.session.user)
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
}

const dahsbordadmin =(req,res,next)  =>{
    if (!req.session.user) {
       return res.redirect('/login');
     }
     var us = req.session.user;
     var i =0;
     Annonce.find()
     .then(response =>{
        if (response.length==0) {
            
              
            req.session.user={user:req.session.user.user, annonces :[]};  
            res.render('sidemenuHome',req.session.user ) 
        }
     response.forEach(annonce=>{
         User.findOne({_id:annonce.id_annoncer})
         .then(user =>{ 
           i++;
  
             annonce.id_annoncer=JSON.stringify({
                 Profession:user.Profession,
                 name:user.Name,
                 id:user._id,
                 avatar:user.avatar,
                 type:user.type
             });
            // console.log("auth : "+user)    
             
             if(i==response.length){
               //  console.log(response)     
               Campus.find().then(facultes =>{
                    Lieu.find({id_type:'6242d1d43d78410e3805cfa7'})
                    .then(departement => {
                        TypeAutiorite.find().then(typesA =>{
                            //console.log(facultes)
                            req.session.user={user:req.session.user.user, annonces:response,departement:departement,facultes:facultes,type:typesA};  
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

    }
const store = (req,res,next)=>{
    if (!req.session.autorite) {
        return res.redirect('/login');
      }
    let annonce = new Annonce({
        titre:req.body.titre,
        description:req.body.description,
        minsup:req.body.minsup,
        universite:req.body.universite,
        faculte:req.body.faculte,
        departement:req.body.departement, 
        type:req.body.type,
        etat:"0",
        id_annoncer:req.body.id_annoncer,
        comment:req.body.comment,
        id_admin:req.body.id_admin     
    });

    if(req.files){
        let path ='';
        req.files.forEach(function(files,index,array) {
            path = path + files.path +',';
        });
        path =path.substring(0,path.lastIndexOf(","))
        annonce.document = path;
    }else{
        annonce.document = "none"
    }

    annonce.save().then(response =>{
        res.send('Registerd successfully');
    }).catch(error=>{
        res.render("error404",{message:"Page not found"})
    })
}

const show =(req,res,next)=>{
    let annonceID=req.body.annonceID

    Annonce.findById(annonceID)
    .then(reponse =>{
        if(reponse){
            res.json({
                reponse
            })
        }else{
            res.status(404).send({
                message:"Annonce non existant"
            })
        }
    }).catch(error=>{
        res.json({
            message:'une erreur est survenu!'
        })
    })
}
function text(state) {
    var text ="";
    switch (state) {
        case 0:
            text= "Annonce en valider";
            return text;
            break;
            case 1:
                text= "Annonce en attente";
                return text;
                break;
            case 2:
                text= "Annonce en rejete";
                return text;
                break;
        default:
            break;
    }
    
    
}

const annonceBystate = (req,res,next)=> {
    if (!req.session.user) {
        return res.redirect('/login');
      }
  
      var i =0;
    Annonce.find().where('etat').equals(req.params.state)
    .then( reponse =>{
                            
      if (reponse.length==0) {
        switch (req.params.state) {
                                
            case "0":    
                req.session.user          
                res.render('./annonce',{annonces :[], user: req.session.user.user})    
            break;
                
            case "1":
                res.render('./annonce',{annonces :[], user: req.session.user.user})
            break;

            case "2":
                res.render('./annonce',{annonces :[], user: req.session.user.user})
            break;
                
            default:
                // res.render('./authAdmin/ValiderHome',{annonces :reponse, autorite:req.session.autorite.autorite, faculte: faculte, departement:departement,type_annonce:type_annonce}) 
            break;
        } 
      }
            reponse.forEach(annonce=>{
                User.findOne({_id:annonce.id_annoncer})
                    .then(user =>{ 
                    i++;
                        annonce.id_annoncer=JSON.stringify({
                            Profession:user.Profession,
                            name:user.Name,
                            id:user._id,
                            avatar:user.avatar,
                            type:user.type
                        });
                    // console.log("auth : "+user)    
                        
                        if(i==reponse.length){
                            Campus.find().then(facultes =>{
                                Lieu.find({id_type:'6242d1d43d78410e3805cfa7'})
                                .then(departement => {
                                    TypeAutiorite.find().then(typesA =>{
                                        switch (req.params.state) {
                                
                                            case "0": 
                                                req.session.user = {annonces :reponse, user: req.session.user.user,departement:departement,facultes:facultes,type:typesA};            
                                                res.render('./annonce',req.session.user)    
                                            break;
                                                
                                            case "1":
                                                req.session.user = {annonces :reponse, user: req.session.user.user,departement:departement,facultes:facultes,type:typesA};
                                                res.render('./annonce',req.session.user)
                                            break;
                            
                                            case "2":
                                                req.session.user = {annonces :reponse, user: req.session.user.user,departement:departement,facultes:facultes,type:typesA};
                                                res.render('./annonce',req.session.user)
                                            break;
                                                
                                            default:
                                                // res.render('./authAdmin/ValiderHome',{annonces :reponse, autorite:req.session.autorite.autorite, faculte: faculte, departement:departement,type_annonce:type_annonce}) 
                                            break;
                                        } 
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
        
    }).catch(error=>{
        res.json({
            message:'une erreur est survenu!'
        })
    })
}
          

const annoncebyAutorite = async (req,res,next)=>{
    if (!req.session.autorite) {
        return res.redirect('/auth/login');
      }

    let annonceID=req.session.autorite.autorite._id;
    //console.log(req.session.autorite.autorite.idcampus)
    var filiere= await Filiere.find();
    //console.log(req.session.autorite.autorite)
    Lieu.find().where('id_type').equals('6242d1d43d78410e3805cfa7').where('id_campus').equals(req.session.autorite.autorite.idcampus).exec((err,lieu)=>{
    

        if(lieu){
            var departement =[];
            lieu.forEach(element => {
                //console.log(element._id)
                departement.push(element._id);
            });

            Type_annonce.find()
            .then(type_annonce =>{
                    //console.log(type_annonce)
                Campus.find()
                .then(campus =>{

                    if(campus){
                        var faculte=[];
                        campus.forEach(element => {
                            faculte.push(element._id);
                        });

                        Annonce.find().where('id_annoncer').equals(annonceID).where('etat').equals(req.params.state)
                        .then( reponse =>{
                            
                        
                            
                                var i =0;

                                //console.log(reponse.length)

                                if(reponse.length == 0){
                                    var  message =req.params.state==1?"Annonce valider":req.params.state==0?"Annonce en attente":"Annonce rejete";
                                    reponse.message=message;
        
                                    switch (req.params.state) {
                                    
                                        case "0":   
                                            res.render('./authAdmin/AttenteHome',{annonces :reponse, autorite:req.session.autorite.autorite, faculte: faculte, departement:departement,type_annonce:type_annonce,filiere:filiere}) 
                                        break;
        
                                        case "1":
                                            res.render('./authAdmin/ValiderHome',{annonces :reponse, autorite:req.session.autorite.autorite, faculte: faculte, departement:departement,type_annonce:type_annonce,filiere:filiere}) 
                                        break;
                                            
                                        case "2":
                                            res.render('./authAdmin/Home',{annonces :reponse, autorite:req.session.autorite.autorite, faculte: faculte, departement:departement,type_annonce:type_annonce,filiere:filiere}) 
                                        break;
        
                                        default:
                                            //res.render('./authAdmin/Home',{annonces :reponse, autorite:req.session.autorite.autorite, faculte: faculte, departement:departement,type_annonce:type_annonce})
                                        break;
                                    }  
                                }else{
                                    reponse.forEach(annos => {
                                        Type_annonce.findOne({_id:annos.type})
                                        .then(t =>{
                                            console.log("type:"+t)
                                            if(t){
                                                annos.type=JSON.stringify({
                                                    id:t._id,
                                                    intitule:t.intitule
                                                });
                                            
                                            i++;
                                            annos.type=JSON.stringify({
                                                id:t._id,
                                                intitule:t.intitule
                                            });
        
                                            if(i==reponse.length){
                                                var  message =req.params.state==1?"Annonce valider":req.params.state==0?"Annonce en attente":"Annonce rejete";
                                                reponse.message=message;
                    
                                                switch (req.params.state) {
                                                
                                                    case "0":   
                                                        res.render('./authAdmin/ValiderHome',{annonces :reponse, autorite:req.session.autorite.autorite, faculte: faculte, departement:departement,type_annonce:type_annonce,filiere:filiere}) 
                                                    break;
                    
                                                    case "1":
                                                        res.render('./authAdmin/AttenteHome',{annonces :reponse, autorite:req.session.autorite.autorite, faculte: faculte, departement:departement,type_annonce:type_annonce,filiere:filiere}) 
                                                    break;
                                                        
                                                    case "2":
                                                        res.render('./authAdmin/Home',{annonces :reponse, autorite:req.session.autorite.autorite, faculte: faculte, departement:departement,type_annonce:type_annonce,filiere:filiere}) 
                                                    break;
                    
                                                    default:
                                                        //res.render('./authAdmin/Home',{annonces :reponse, autorite:req.session.autorite.autorite, faculte: faculte, departement:departement,type_annonce:type_annonce})
                                                    break;
                                                } 
                                            }
                                        }
                                        })
                                    });
                                }
                                //console.log(reponse)               
                            
                            
                        }).catch(error=>{
                            res.json({
                                message:'une erreur est survenu!'
                            })
                        })
                    }
                }).catch(error =>{
                    
                    })

            })
            .catch(error =>{
                res.json({
                    message:'une erreur est survenu!'
                })
            })   
        }
    })
}

const update = (req,res,next) =>{
    var document = "";
    var id_ann = req.body.annonceid;
    var docURL = req.body.documentURL;
    var docRep = req.body.documentReplace;
    var docS;

    let updateInfo={
        titre:req.body.titre,
        description:req.body.description,
        minsup:req.body.minsup,
        universite:req.body.universite,
        faculte:req.body.faculte,
        departement:req.body.departement,
        filiere:req.body.filiere,
        type:req.body.type,
        etat:0, 
		id_annoncer:req.body.id_annoncer,
        comment:"",
        id_admin:""
    };

    let tabdoc = docURL.split(',');
    let tabreplace = docRep.split(',');

    docS = docURL;

    for (let i = 0; i < tabreplace.length; i++) {
        if(tabreplace[i] == 'r'){
            fs.unlink(tabdoc[i], (err) => {
                if (err) {
                    console.error(err)
                }
            });
            if(i == 0){
                docS = docRep.replace(tabreplace[i]+',',"");
            }else{
                docS = docRep.replace(','+tabreplace[i],"");
            }
        }
    }

    //var path1 = '';
    if(req.files){
        let path ='';
        req.files.forEach(function(files,index,array) {
            path =path +files.path +',';
        });
        path =path.substring(0,path.lastIndexOf(","))
        docS = docS +","+ path; 
    }

    updateInfo.document = docS;

    Annonce.findByIdAndUpdate(id_ann,{$set:updateInfo})
    .then(response =>{
        res.send('Enregistre avec success');
    })
    .catch(error =>{
        res.render('error404',{message:'something went wrong'});
    })
}

const destroy =(req,res,next)=>{
var path ='';
let annonceID=req.body.annonceID
Annonce.findById(req.body.annonceID)
    .then(response =>{
        path =response.document.split(',')
//
//supression
Annonce.findByIdAndRemove(annonceID)
.then(response =>{
  
    path.forEach(path=>{
        fs.unlink(path, (err) => {
            if (err) {
                console.error(err)
            }});
    })
        res.json({
            message:'Annonce supprimer avec succes',
    })
})
.catch(error =>{
   res.json({
       message:'une erreur est survenu lors de la suppression du lieu'
   })
})
        
    })
    .catch(error =>{
        res.json({
            message:error.message==="Cannot read property 'split' of null" ? 'image non existante':error.message,
        })
    })

}

/*filter all annonce by university, faculty and departement */
const ByAllUniversite =(req,res,next)=>{
    if (!req.session.user) {
        return res.redirect('/login');
      }
      var us = req.session.user;
      var i =0;
      var faculte = req.body;
      Annonce.find({faculte:""})
      .then(response =>{
 
      response.forEach(annonce=>{
          User.findOne({_id:annonce.id_annoncer})
          .then(user =>{ 
            i++;
            console.log("auth2 : "+user)
              annonce.id_annoncer=JSON.stringify({
                  Profession:user.Profession,
                  name:user.Name,
                  id:user._id,
                  avatar:user.avatar,
                  type:user.type
              });
             // console.log("auth : "+user)    
              
              if(i==response.length){
                //  console.log(response)     
                
                req.session.user={user:req.session.user.user, annonces :response};  
                 res.render('sidemenuHome',req.session.user ) 
                 
              }  
          })
 
          })       
      })
      .catch(error =>{
          res.render('error404',{message:'something went wrong'})
      })
}

const ByAllFaculte =(req,res,next)=>{
    Annonce.find({departement:""})
    .then(annonce=>{
        if(annonce){
            res.json({
                // annonce
                message:ok
            })
        }
    })
    .catch(error=>{
        res.json({
            message:error
        })
    })
}
/********************************************************* */

const ByMinsup =(req,res,next)=>{
    var minsup = req.body.minsup;
    Annonce.find({minsup:minsup})
    .then(annonce=>{
        if(annonce){
            res.json({
                annonce
            })
        }
    })
    .catch(error=>{
        res.json({
            message:error
        })
    })
}

const ByUniversite =(req,res,next)=>{
    var universite = req.body.universite;
    Annonce.find({universite:universite})
    .then(annonce=>{
        if(annonce){
            res.json({
                annonce
            })
        }
    })
    .catch(error=>{
        res.json({
            message:error
        })
    })
}

const ByFaculte =(req,res,next)=>{
    var faculte = req.body.faculte;
    Annonce.find({faculte:faculte})
    .then(annonce=>{
        if(annonce){
            res.json({
                annonce
            })
        }
    })
    .catch(error=>{
        res.json({
            message:error
        })
    })
}

const ByDepartement =(req,res,next)=>{
    var departement = req.body.departement;
    Annonce.find({departement:departement})
    .then(annonce=>{
        if(annonce){
            res.json({
                annonce
            })
        }
    })
    .catch(error=>{
        res.json({
            message:error
        })
    })
}

const ByFiliere =(req,res,next)=>{
    var filiere = req.body.filiere;
    Annonce.find({filiere:filiere})
    .then(annonce=>{
        if(annonce){
            res.json({
                annonce
            })
        }
    })
    .catch(error=>{
        res.json({
            message:error
        })
    })
}

const ByIdAnnonceur =(req,res,next)=>{
    var id = req.body.id;
    Annonce.find({id_annoncer:id})
    .then(annonce=>{
        if(annonce){
            res.json({
                annonce
            })
        }
    })
    .catch(error=>{
        res.json({
            message:error
        })
    })
}

const validate = (req,res,next) => {
    var id = req.body.id;
    console.log(id);
    var ann ;

    Annonce.findById(id)
    .then(annonce =>{
        let updateInfo={
            titre:annonce.titre,
            description:annonce.description,
            minsup:annonce.minsup,
            universite:annonce.universite,
            faculte:annonce.faculte,
            departement:annonce.departement,
            filiere:annonce.filiere,
            type:annonce.type,
            etat:1, 
            id_annoncer:annonce.id_annoncer,
        };

        Annonce.findByIdAndUpdate(id,{$set:updateInfo})
        .then(response =>{
            res.send('Post request received');
        })
    })   
}

const rejeter = (req,res,next) => {
    var id = req.body.id;
    console.log(id);
    var ann ;

    Annonce.findById(id)
    .then(annonce =>{
        let updateInfo={
            titre:annonce.titre,
            description:annonce.description,
            minsup:annonce.minsup,
            universite:annonce.universite,
            faculte:annonce.faculte,
            departement:annonce.departement,
            filiere:annonce.filiere,
            type:annonce.type,
            etat:2, 
            id_annoncer:annonce.id_annoncer,
            comment:req.body.comment,
            id_admin:req.body.id_admin
        };

        Annonce.findByIdAndUpdate(id,{$set:updateInfo})
        .then(response =>{
            res.send('Post request received');
        })
    })   
}

module.exports={
    index,destroy,show,store,update,ByMinsup,ByUniversite,ByFaculte,ByDepartement,ByFiliere,ByIdAnnonceur,annoncebyAutorite,dahsbordadmin,ByAllUniversite,ByAllFaculte,annonceBystate,validate,rejeter
}