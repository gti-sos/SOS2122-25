const cool = require("cool-ascii-faces");
const express = require("express");
const bodyParser = require("body-parser")
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

const economies_stats_API = require("./src/back/economies-stats-v2.js");
const esco_stats_API = require("./src/back/esco-stats.js");
const expo_stats_API = require("./src/back/expo-stats.js");
const Datastore = require('nedb');



db_economies_stats = new Datastore();
db_esco_stats = new Datastore();
db_expo_stats = new Datastore();

const cors = require("cors"); 
const request = require("request");


app.use(cors());

//Proxy economies
var paths='/remoteAPI';
var apiServerHost = 'https://sos2122-20.herokuapp.com/api/v2/economies';


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




