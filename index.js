const cool = require("cool-ascii-faces");
const express = require("express");
const bodyParser = require("body-parser")
const cors = require("cors"); 
const request = require("request");
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

app.use(cors());

const economies_stats_API = require("./src/back/economies-stats-v2.js");
const esco_stats_API = require("./src/back/esco-stats.js");
const expo_stats_API = require("./src/back/expo-stats.js");
const Datastore = require('nedb');

/*
var jwt = require('jsonwebtoken')

user=1234;

function generateToken(user) {
  var u = {
   username: user.username,
   id: user.id
  }
  return token = jwt.sign(u, 1234, {
     expiresIn: 60 * 60 * 24 // expires in 24 hours
  })
}
*/

db_economies_stats = new Datastore();
db_esco_stats = new Datastore();
db_expo_stats = new Datastore();


//Proxy economies
var paths='/remoteAPI';
var apiServerHost = 'https://sos2122-20.herokuapp.com/api/v1/fertilizers-stats';

app.use(paths, function(req, res) {
    var url = apiServerHost + req.url;
    console.log('piped: ' + req.url);
    req.pipe(request(url)).pipe(res);
  });
  


economies_stats_API.register(app,db_economies_stats);
esco_stats_API.register(app,db_esco_stats);
expo_stats_API.register(app,db_expo_stats);

app.use("/", express.static(`public`))

app.get("/cool", (req,res)=>{
    console.log("Requested /cool route");
    res.send("<html><body><h1>" + cool()+ "</h1></body></html>")
});

app.listen(port, ()=>{
    console.log(`Server ready at port ${port}`);
});

/*
app.use('/',function(req, res, next) {
    generateToken(user)
    var token = req.headers['authorization']
    if (!token) {
      res.status(401).send({
        ok: false,
        message: 'Toket inválido'
      })
    }
  
    token = token.replace('Bearer ', '')
  
    jwt.verify(token, 1234, function(err, token) {
      if (err) {
        return res.status(401).send({
          ok: false,
          message: 'Toket inválido'
        });
      } else {
        req.token = token
        next()
      }
    });
  });
*/


