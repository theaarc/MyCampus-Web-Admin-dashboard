const Type_annonce = require('../Models/typeAnnonce');
const jwt = require('jsonwebtoken');
const { json } = require('body-parser');
const { userInfo, type } = require('node:os');
const fs = require('fs')

const Campus = require('../Models/Campus');
const TypeAutiorite = require('../Models/typeUser');
const Lieu=require('../Models/lieu')

const index = (req,res,next)=>{
    if (!req.session.user) {
        return res.redirect('/login');
    }else{
        Type_annonce.find()
        .then(response =>{
            Campus.find().then(facultes =>{
                Lieu.find({id_type:'6242d1d43d78410e3805cfa7'})
                .then(departement => {
                    TypeAutiorite.find().then(typesA =>{
                        console.log(facultes)
                        req.session.user={user:req.session.user.user, annonces:req.session.user.annonces, typeAnnonce :response, departement:departement, facultes:facultes, type:typesA};  
                        res.render('type_annonce', req.session.user)
                    }).catch(error =>{
                        res.render("error404",{message:"Page not found"})
                    })
                })
            }).catch(error =>{
                res.render("error404",{message:"Page not found"})
            }) 
        })
        .catch(error =>{
            res.render('error404',{message:'something went wrong'})
        })
    }
}

    const store=(req,res,next)=>{
            let type_annonce = new Type_annonce({
                intitule : req.body.intitule
            });
            
            type_annonce.save().then(type_annonce =>{
               res.json({
                   message:"Type_annonce creer avec succes"
               })
            }).catch(error=>{
                res.render('error404',{message:'something went wrong'})
            });
    }

    const show =(req,res,next)=>{
        let type_annonceID = req.body.type_annonceID

        Type_annonce.findById(type_annonceID)
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
            
                let updateData={
                    intitule:req.body.intitule,
                };

                Type_annonce.findByIdAndUpdate(req.body.typeid,{$set:updateData})
                .then(response =>{
                res.json({
                    message:'modification effectuer avec success',
                })
            })
            .catch(error =>{
                res.render('error404',{message:'something went wrong'})
            })
        }
       
        const destroy =(req,res,next)=>{
         
            let type_annonceID = req.body.type_annonceID
            Type_annonce.findById(type_annonceID).then(type_annonce=>{
                console.log(type_annonce);
                });
                Type_annonce.findByIdAndRemove(type_annonceID)
                        .then(response =>{
                            res.json({
                                message:'suppression effectue avec succes',
                            })
                        })
                        .catch(error =>{
                            res.render('error404',{message:'something went wrong'})
                    })
            }

    module.exports ={
        store,index,show,update,destroy
    }