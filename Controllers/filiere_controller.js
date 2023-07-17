const Filiere = require('../Models/filiere');
const jwt = require('jsonwebtoken');
const { json } = require('body-parser');
const { userInfo, type } = require('node:os');
const fs = require('fs')
const Campus = require('../Models/Campus')

const Lieu=require('../Models/lieu')
const get= (req,res,next)=>{
    Filiere.find()
    .then(async response =>{
        res.json({
            message:response
        })
    }).catch(error =>{
        res.json({
            message:error
        })
    })
}

const index = (req,res,next)=>{
    if (!req.session.user) {
        return res.redirect('/login');
      }


  Filiere.find()
    .then(async response =>{
        const [   facs, departs] = await Promise.all([
           
            Campus.find(),
            Lieu.find({id_type:"6242d1d43d78410e3805cfa7"}),// liste des departements
             
        ]);
        
   var i=0;
   if (response.length==0) {
    
    console.log(departs)
    data={user:req.session.user.user, filiere :[],facs:facs,departs:departs};  
    res.render('filiere',data ) 

}

    response.forEach(async fil=>{
        const [ id_campus,departement] = await Promise.all([
            Campus.findOne({_id: fil.id_campus}),
            Lieu.findOne({_id:fil.departement}),
             
        ]);
      
        i++;
        fil.id_campus = JSON.stringify({
            intitule:id_campus==null?"":id_campus.intitule,
            id:id_campus==null?"":id_campus._id
        });

        fil.departement = JSON.stringify({
            intitule:departement==null?"":departement.intitule,
            id:departement==null?"": departement._id
        });
        console.log( fil.departement)
if (i==response.length) {
    console.log(response)
    data={user:req.session.user.user, filiere :response,facs:facs,departs:departs};  
    res.render('filiere',data ) 
}
    });
   
    })
    .catch(error =>{
        res.json({
            message:error
        })
    })
    }

    const store=(req,res,next)=>{
        console.log(req.body)
            let filiere = new Filiere({
                intitule : req.body.intitule,
                departement:req.body.departs,
                id_type:"",
                id_campus:req.body.id_campus,
                description:req.body.description,
            });
            if(req.files){
                let path ='';
                req.files.forEach(function(files,index,array) {
                    path =path +files.path +',';
                });
                path =path.substring(0,path.lastIndexOf(","))
                type.image = path;
            }
            filiere.save().then(filiere =>{
               res.json({
                   message:"filiere creer avec succes"
               })
            }).catch(error=>{
                   res.json({
                       error:error.message,
                   })
            });
    }

    const show =(req,res,next)=>{
        let filiereID = req.body.filiereID

        Filiere.findById(filiereID)
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
            console.log(req.body.filiereID);
            
            let updateData={
                intitule : req.body.intitule,
                departement:req.body.departement,
                id_type:req.body.id_type,
                id_campus:req.body.id_campus,
                description:req.body.description,
                image:req.body.image
            };
            if(req.files){
                let path ='';
                req.files.forEach(function(files,index,array) {
                    path =path +files.path +',';
                });
                path =path.substring(0,path.lastIndexOf(","))
                updateData.image = path;
            }

            Filiere.findByIdAndUpdate(req.body.filiereID,{$set:updateData})
            .then(response =>{
            res.json({
                message:'modification effectuer avec success',
          })
        })
        .catch(error =>{
           res.json({
               message:'une erreur est survenu lors de la modification de votre compte'
           })
        })
        }
       
        const destroy =(req,res,next)=>{
         
            let filiereID = req.body.filiereID
            Filiere.findById(filiereID).then(filiere=>{
                console.log(filiere);
                });
                Filiere.findByIdAndRemove(filiereID)
                        .then(response =>{
                            res.json({
                                message:'suppression effectue avec succes',
                            })
                        })
                        .catch(error =>{
                            res.json({
                                message:'une erreur est survenu lors de la suppression de la personaliter'
                        })
                    })
            }

    module.exports ={
        store,index,show,update,destroy,get
    }