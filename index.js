
const express           = require("express")
const mongoose          = require("mongoose")
const morgan            = require("morgan")
const bodyParser        = require("body-parser") 
const session = require('express-session');
const MongoStore = require('connect-mongo')

const Annonce = require('./Models/annonce');

const Authweb = require("./webRoute/Auth")
const annonceWeb = require("./webRoute/annonce_route")
const autoriteWeb = require("./webRoute/autorite")
const lieuWeb = require("./webRoute/lieu")
const typeAuth = require("./webRoute/type_auth_route")
const typeAnnon = require("./webRoute/type_annonce_route")
const webtypeLieu = require("./webRoute/type_lieu_route")
const typeLieu = require("./Routes/typeLieu")
 const cors  = require("cors")



const AuthRoute         = require("./Routes/Auth")
const partenaireRoute         = require("./Routes/partenaire")
const autoriteRoute         = require("./Routes/autorite")
const favorieplace         = require("./Routes/favorieplace")
const lieu        = require("./Routes/lieu")
const campus      = require("./Routes/Campus")
const commande          = require("./Routes/commande")
 const service          = require("./Routes/service")
 const pub          = require("./Routes/pub")
 const route          = require("./Routes/Route")
 //const typeLieu          = require("./Routes/typeLieu")
 const boutique         = require("./Routes/Boutique")
 const categorisPub         = require("./Routes/Categorispub")
 const annonce_route = require("./Routes/annonce_route")
const type_annonce_route = require("./Routes/type_annonce_route")
const campusweb=require("./webRoute/campus")
const filiere=require("./webRoute/filiere")
//  const Sig        = require("./Routes/Sig")
const open =require('open');
const epreuve =require('./Routes/epreuve');

const ipAddress = process.env.IP_ADDRESS || 'localhost';

global.url="http://localhost:5000/"
mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://127.0.0.1:27017/mycampus',{useNewUrlParser:true,useUnifiedTopology:true})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch((err) => console.log(err ));
const db = mongoose.connection
const app= express()

const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json({limit: '300mb'}))
app.set('view engine', 'ejs');
app.use('/upload',express.static(__dirname + '/upload'))
app.set('/views', express.static(__dirname + '/views'));
app.use('/publics',express.static(__dirname + '/publics'));
app.set('/component',express.static(__dirname + '/component'));

app.use(cors());

const port = process.env.port || 5000
app.listen(port,()=>{

});

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,

   // store: new MongoStore({ mongooseConnection: mongoose.connection }),
  }));
open('172.20.10.3:5000/',{app: {name: 'google chrome', arguments: ['--incognito']}});

// Array to store connected clients
const connectedClients = [];

// Handle SSE endpoint connection
app.get('/sse', (req, res) => {
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Create a new client object with the response object
  const client = {
    id: generateUniqueId(), // Generate a unique ID for the client
    res: res, // Store the response object
  };

  // Add the client to the array of connected clients
  connectedClients.push(client);

  // Handle disconnection
  req.on('close', () => {
    // Remove the client from the array of connected clients
    const index = connectedClients.findIndex(c => c.id === client.id);
    if (index > -1) {
      connectedClients.splice(index, 1);
    }
  });
});

// Function to generate a unique ID
function generateUniqueId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

app.get('/post', (req, res) => {

  const message = 'A new announcement was posted!';
    // Send a notification event to all connected clients
    sendSSE('newAnnouncement', { message });

});

// Function to send SSE event to all connected clients
function sendSSE(event, data) {
  const formattedData = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;

  connectedClients.forEach(client => {
    client.res.write(formattedData);
  });
}

// // Render your EJS file

app.get('/test', (req, res) => {
  res.render('test');
});



/*************************************web admin routes*********************************************** */
  /************************route for defaut admin pages(web admin)******************* */
    app.get('/dahsbordadmin/', function(req, res) {

      if (!req.session.user) {

          return res.redirect('/login');
        }

        res.redirect("/web/annonce/dahsbordadmin/");

    });

    /************************route for login page(web admin)******************* */
    app.get('/', function(req, res) {
      res.render('login');
    });

    app.get('/login', function(req, res) {
      res.render('login');
    });

    /************************route for annonce page(web admin)******************* */
    app.get('/annonce/', function(req, res) {
      
      if (!req.session.user) {
        return res.redirect('/login');
      }

    res.redirect("/web/annonce/");
  
    });
    
      /************************route for user page(web admin)******************* */
      app.get('/user/', function(req, res) {
      
        if (!req.session.user) {
          return res.redirect('/login');
        }
    
        res.redirect("/web/user/");
      // res.render('user', req.session.user);
    
      });

      /************************route for lieu page(web admin)******************* */
      app.get('/lieu/', function(req, res) {
      
        if (!req.session.user) {
          return res.redirect('/login');
        }
    
        res.redirect("/web/lieu/");
      // res.render('user', req.session.user);
    
      });

    /************************route for types page(web admin)******************* */
    app.get('/type_auth', function(req, res) {
      
      if (!req.session.user) {
        return res.redirect('/login');
      }
      res.redirect("/web/typeAuth");
    });

    app.get('/type_annonce', function(req, res) {
      
      if (!req.session.user) {
        return res.redirect('/login');
      }
      res.redirect("/web/typeAnnonce");
    });

    app.get('/typeLieu', function(req, res) {
      
      if (!req.session.user) {
        return res.redirect('/login');
      }
      res.redirect("/web/typeLieu");
    });
    app.get('/filiere', function(req, res) {
      
      if (!req.session.user) {
        return res.redirect('/login');
      }
      res.redirect("/web/filiere");
    });


    /********************** route des modification profile(web admin) ********************* */
    app.get('/admin/modifprof', function(req, res){

      if (!req.session.user) {
        return res.redirect('/login');
      }

      req.session.user = {user: req.session.user.user,annonces:req.session.user.annonces, facultes:req.session.user.facultes, departement:req.session.user.departement}
      res.render('./userprofile',req.session.user)  
      // res.render('user', req.session.user);
    
    })

    /********************** route des modification profile(web admin) ********************* */
    app.get('/admin/addadmin', function(req, res){

      if (!req.session.user) {
        return res.redirect('/login');
      }

      res.render('./addadmin',{user: req.session.user.user,annonces:req.session.user.annonces, facultes:req.session.user.facultes, departement:req.session.user.departement, type:req.session.user.type})  
      // res.render('user', req.session.user);
    
    })

    app.get('/logout', (req, res) => {
      req.session.destroy(err => {
        if (err) {
          console.error('Error destroying session:', err);
        } else {
          res.redirect('/login');
        }
      });
    });
    


/*************************************autorities routes*********************************************** */
  /************************route for login page(autorite)******************* */
  app.get('/auth/login', function(req, res) { 
    res.render('loginAut');
  });

app.get('/auth', function(req, res) {
    
  if (!req.session.autorite) {

      return res.redirect('/auth/login');
    }
    res.redirect('/web/annonce/annoncebyAutorite/2')
  
});

  app.get('/auth/homeValide', function(req, res) {
    
      if (!req.session.autorite) {
        return res.redirect('/auth/login');
      }
        //res.render('./authAdmin/ValiderHome',autorite = req.session.user);
        res.redirect('/web/annonce/annoncebyAutorite/1')
  });

  app.get('/auth/homeAttente', function(req, res) {
    
        if (!req.session.autorite) {
          return res.redirect('/auth/login');
        }
        res.redirect('/web/annonce/annoncebyAutorite/0')
   });

   app.get('/auth/addauth', function(req, res){

    if (!req.session.autorite) {
      return res.redirect('/auth/login');
    }

    res.render('./authAdmin/addAuth',{autorite: req.session.autorite.autorite, annonces:req.session.autorite.annonces, facultes:req.session.autorite.facultes, departement:req.session.autorite.departement, type:req.session.autorite.type})  
    // res.render('user', req.session.user);
  
  })

  app.get('/auth/modifauth', function(req, res){

    if (!req.session.autorite) {
      return res.redirect('/auth/login');
    }

    res.render('./authAdmin/modifauth',{autorite: req.session.autorite.autorite,annonces:req.session.autorite.annonces, facultes:req.session.autorite.facultes, departement:req.session.autorite.departement, type:req.session.autorite.type})  
    // res.render('user', req.session.user);
  
  })

  app.get('/auth/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
      } else {
        res.redirect('/auth/login');
      }
    });
  });


/************************************web routes***************************************************** */
  app.use('/web/user/',Authweb);
  app.use('/web/annonce',annonceWeb);
  app.use('/web/lieu/', lieuWeb);
  app.use('/web/typeAuth', typeAuth);
  app.use('/web/typeAnnonce', typeAnnon);
  app.use('/web/typeLieu', webtypeLieu);
  app.use('/web/faculte',campusweb);
  app.use('/web/filiere',filiere);
  app.use('/api/filiere',filiere);
 

  app.use('/webAut/autorite', autoriteWeb);


app.use('/api/users',AuthRoute);
app.use('/api/partenaire',partenaireRoute);
app.use('/api/autorite',autoriteRoute);
app.use('/api/favorieplace',favorieplace);
app.use('/api/campus',campus);
app.use('/api/lieu',lieu);
app.use('/api/commande',commande);
app.use('/api/service',service);   
app.use('/api/pub',pub);
app.use('/api/polyline',route);
app.use('/api/typeLieu',typeLieu);
app.use('/api/boutique',boutique);
app.use('/api/categorisPub',categorisPub);
app.use('/api/epreuve',epreuve);
//confidencialite

//app.use('/api/users',user_route);
app.use('/api/annonce',annonce_route);
app.use('/api/typeAnnonce',type_annonce_route);
// app.use('/api/sig',Sig);
// https://shielded-falls-07947.herokuapp.com/heroku local web
