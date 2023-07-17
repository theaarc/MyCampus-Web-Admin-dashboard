const Type_Lieu = require('../Models/typelieu');
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
        Type_Lieu.find()
        .then(response =>{
            Campus.find().then(facultes =>{
                Lieu.find({id_type:'6242d1d43d78410e3805cfa7'})
                .then(departement => {
                    TypeAutiorite.find().then(typesA =>{
                        console.log(facultes)
                        req.session.user={user:req.session.user.user, annonces:req.session.user.annonces, typeLieu :response, departement:departement,facultes:facultes,type:typesA};  
                        res.render('type_lieu', req.session.user)
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
            let type_lieu = new Type_Lieu({
                intitule : req.body.intitule
            });
            
            type_lieu.save().then(type_lieu =>{
               res.json({
                   message:"Type_Lieu creer avec succes"
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

                Type_Lieu.findByIdAndUpdate(req.body.typeid,{$set:updateData})
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
         
            let type_lieuID = req.body.type_lieuID
            Type_Lieu.findById(type_lieuID).then(type_lieu=>{
                    console.log(type_lieu);
                });
                Type_Lieu.findByIdAndRemove(type_lieuID)
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