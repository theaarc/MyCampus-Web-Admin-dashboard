const Annonce = require('../Models/annonce');
const bcrypt =require('bcryptjs');
const jwt = require('jsonwebtoken');
const { json } = require('body-parser');
const { userInfo } = require('node:os');
const fs = require('fs');
const { response } = require('express');
const User = require('../Models/autorite');


const index = (req,res,next)=>{
    Annonce.find()
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

const store = (req,res,next)=>{

   storing(req,res);
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

const update = (req,res,next) =>{
    let updateInfo={
        titre:req.body.titre,
        description:req.body.description,
        minsup:req.body.minsup,
        universite:req.body.universite,
        faculte:req.body.faculte,
        departement:req.body.departement,
        filiere:req.body.filiere,
        type:req.body.type,
        etat:req.body.etat,
        id_annoncer:id_annoncer,
    };

    var path1 = '';
    if(req.files){
        Annonce.findById(req.body.annonceID).then(annonce=>{
           path1 = annonce.document + ',';
           console.log("premier :" +path1);

           req.files.forEach(function(files,index,array) {
                path1 = path1 + files.path +',';
             });
            path1 =path1.substring(0,path1.lastIndexOf(","))
            console.log("yo " + path1);
            updateInfo.document = path1;

                Annonce.findByIdAndUpdate(req.body.annonceID,{$set:updateInfo})
                 .then(response=>{
                    res.json({
                        message:'modification effectuer avec success',
                    })
                })
                .catch(error =>{
                    res.json({
                        message:'une erreur est survenu lors de la modification de votre compte' 
                })
            })
        });
    }
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
    var faculte = req.params.idfac;
    console.log(faculte)
    var i =0;
    Annonce.find({faculte:req.params.idfac}).where('etat').equals("0")
    .then(response=>{
        if (response.length==0) {
            res.json({
                response
            })
        }
        
        if(response){

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
                      
                      res.json({
                        response
                    })
                       
                    }  
                })
       
                })
           
        }
    })
    .catch(error=>{
        res.json({
            message:error
        })
    })
}

const ByRecteur =(req,res,next)=>{
   
    var i =0;

    Annonce.find({departement:"",faculte:"",filiere:""}).where('etat').equals("0")
    .then(response=>{
        if (response==[]) {
            res.status(404).json({
                response
            })
        }
        if(response){
            console.log(response)   
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
                      console.log(response)     
                      
                      res.json({
                        response
                    })
                       
                    }  
                })
       
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
    var filiere = req.params.idfiliere ;
    Annonce.find({filiere:filiere})
    .then(response=>{
        if(response.length==0){
            res.status(404).json({
                response
            })
        }
        var i=0;
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
                  
                  res.json({
                    response
                })
                   
                }  
            })
   
            })
    })
    .catch(error=>{
        res.json({
            message:error
        })
    })
}
module.exports={
    index,destroy,show,store,update,ByMinsup,ByUniversite,ByFaculte,ByRecteur,ByFiliere
}

/****************************************function for adding annonces**************************************/
function storing(request,res){

    var facs = null;
    console.log(request.body)

    switch(request.body.code)
    {
        case "63f63957b0cc1c35f852bf48":  //  type recteur id

            var id = request.body.id;
            Annonce.findById(id)
            .then(anonce =>{
                console.log(anonce)

   dep= [1];
  // anonce.state="0";
 var  Annonces = dep.map(chose => {

                    return {
                        titre:anonce.titre,
                        description:anonce.description,
                        minsup:anonce.minsup,
                        universite:anonce.universite,
                        faculte:anonce.faculte,
                        departement:anonce.departement,
                     filiere:"",
                        type:anonce.type,
                        etat:0,
                        document:anonce.document,
                        id_annoncer:anonce.id_annoncer,
                    };
                });

                Annonce.findByIdAndRemove(id)
                .then(response =>{
                    Annonce.insertMany(Annonces)
                    .then(() => {
                        console.log(" annonce publiée  dans les facultes respectives avec success");
                        res.status(200).json("anonce publier  das les facultes respectives avec success");
                    })
                    .catch(err => res.status(400).json("Error: " + err));
                });
            });

        break
        case "63f6398eb0cc1c35f852bf4c" :   //  type id doyen
         
            var id = request.body.id;
            Annonce.findById(id)
            .then(anonce =>{
                console.log(anonce)

   
 var  Annonces = dep.map(chose => {

                    return {
                        titre:anonce.titre,
                        description:anonce.description,
                        minsup:anonce.minsup,
                        universite:anonce.universite,
                        faculte:anonce.faculte,
                        departement:departement,
                        filiere:"",
                        type:anonce.type,
                        etat:1,
                        document:anonce.document,
                        id_annoncer:anonce.id_annoncer,
                    };
                });

                Annonce.findByIdAndRemove(id)
                .then(response =>{  
                    Annonce.insertMany(Annonces)
                    .then(() => {
                    console.log("les annonce ont ete publiées  das les departement respectif avec success");
                    res.status(200).json("les annonce ont ete publiées  das les departement respectif avec success");
                    })
                    .catch(err => res.status(400).json("Error: " + err));
    
    
                });
            });
        break 

        default:
            var Annonces;

                var doc = "none";

                var titre = request.body.titre;
                var description = request.body.description;
                var minsup = request.body.minsup;
                var universite = request.body.universite;
                var faculte = request.body.faculte;
                var departement = request.body.departement;
                var filiere = request.body.filiere;
                var type = request.body.type;
                var etat = 0; // en attente
                var code = request.body.code;
                var id_annoncer = request.body.id_annoncer;
                var comment = request.body.comment;
                var id_admin = request.body.id_admin;

                if(request.files){
                    let path ='';
                    request.files.forEach(function(files,index,array) {
                        path = path + files.path +',';
                    });
                    path =path.substring(0,path.lastIndexOf(","))
                    doc = path;
                }else{
                    doc = "none"
                }
                
               

                  
                        Annonces =[{
                            titre:titre,
                            description:description,
                            minsup:minsup,
                            universite:universite,
                            faculte:faculte,
                            departement:departement,
                            filiere:filiere,
                            type:type,
                            etat:"1",
                            document:doc,
                            id_annoncer:id_annoncer,
                        }]
                  
                     

                    Annonce.insertMany(Annonces)
                        .then(() => {
                             console.log("les annonce ajouter avec success en attente ");
                            res.status(200).json("les annonce on ete publier  das les departement respectif avec ");
                        })
                        .catch(err => res.status(400).json("Error: " + err));
        break;
    }
}