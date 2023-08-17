const TypeUser = require('../Models/typeUser');
const jwt = require('jsonwebtoken');
const { json } = require('body-parser');
const { userInfo, type } = require('node:os');
const fs = require('fs')

const Campus = require('../Models/Campus');
const Lieu=require('../Models/lieu')

const index = (req,res,next)=>{
    if (!req.session.user) {
        return res.redirect('/login');
    }else{
        TypeUser.find()
        .then(response =>{
            Campus.find().then(facultes =>{
                Lieu.find({id_type:'6242d1d43d78410e3805cfa7'})
                .then(departement => {
                    TypeUser.find().then(typesA =>{
                        console.log(facultes)
                        req.session.user={user:req.session.user.user, annonces:req.session.user.annonces, typeAuth :response, departement:departement, facultes:facultes, type:typesA};  
                        res.render('type_auth', req.session.user)
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
            let type_users = new TypeUser({
                type_user:req.body.intitule,
                num_reference:req.body.ref
            });
            type_users.save().then(type_users =>{
                res.send('Enregistre avec success');
            }).catch(error=>{
                res.render('error404',{message:'something went wrong'})
            });
    
    }

    const show =(req,res,next)=>{
        let type_userID = req.body.type_userID

        TypeUser.findById(type_userID)
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
                type_user:req.body.intitule,
                num_reference : req.body.ref
            };

            TypeUser.findByIdAndUpdate(req.body.typeid,{$set:updateData})
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
         
            let type_authID = req.body.type_authID
            TypeUser.findById(type_authID).then(type_users=>{
                console.log(type_users);
                });
                TypeUser.findByIdAndRemove(type_authID)
                        .then(response =>{
                            res.json({
                                message:'personaliter  supprimer   avec succes',
                            })
                        })
                        .catch(error =>{
                            res.render('error404',{message:'something went wrong'})
                    })
            }

    module.exports ={
        store,index,show,update,destroy
    }