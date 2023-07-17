const Epreuve =require("../Models/Epreuve");

const index = (req,res,next)=>{
    Epreuve.find()
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
    const getEpreuve = (req,res,next)=>{
        let nivau=req.params.niveau
       let  filiere=req.params.filiere
     let   semestre=req.params.semestre
     console.log(nivau +filiere+semestre)
        Epreuve.find({nivau:nivau,filiere:filiere,semestre:semestre})
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
        let epreuve = new Epreuve({
            intitule:req.body.intitule,
            nivau:req.body.nivau, 
            semestre:req.body.semestre, 
           
            doc:req.body.doc,
            type:req.body.type,
            annee:req.body.annee,
         faculte:req.body.faculte,
            departement:req.body.departement,
            filiere:req.body.filiere
             

        });
        if(req.file){
            epreuve.doc = req.file.path
          //  var img = fs.readFileSync(user.avatar);
           // user.avatar =img.toString('base64');
            

        }
       epreuve.save().then(us =>{

            res.status(200).json({
                message:"epreuve ajouter avec succes",us
            });
           
          
        }).catch(error=>{
               res.status(500).json({
                   error:error.message,
               })
        });
  }
    const update =(req,res,next) =>{
      let  epreuve={
        epreuveID: req.body.id,
            intitule:req.body.intitule,
            nivau:req.body.nivau, 
           
            doc:req.body.doc,
            type:req.body.type,
            annee:req.body.annee,
         faculte:req.body.filiere,
            departement:req.body.departement,
            filiere:req.body.filiere
             

        }
     if(req.file){
            updateData.doc = req.file.doc
            Epreuve.findById(updateData.id).then(epreuve=>{
                console.log(epreuve);
                fs.unlink(epreuve.doc, (err) => {
                    if (err) {
                    console.error(err)
                    
                    }});
          });

        }else if(updateData.avatar===null){
            res.status(400).json({
                message:'document requis',
          });
        }

 Epreuve.findByIdAndUpdate(epreuve.id,{$set:epreuve})
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
        let id= req.body.id
        console.log(id);
        Epreuve.findById(id).then(epreuve=>{
            console.log(epreuve);
            if(epreuve.doc===null){
                epreuve.doc="";
            }
            fs.unlink(epreuve.doc, (err) => {
                if (err) {
                console.error(err)
                
                }});
 Epreuve.findByIdAndDelete(id)
        .then(response =>{
           res.json({
                message:'epreuve supprimer   avec succes',
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
            register,index,destroy,getEpreuve,update
        }