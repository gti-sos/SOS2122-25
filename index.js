const cool = require("cool-ascii-faces");
const express = require("express");
const bodyParser = require("body-parser")
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

const cancerdeaths_stats_API = require("./src/back/cancerdeaths-stats.js");
const esco_stats_API = require("./src/back/esco-stats.js");
const airpollution_stats_API = require("./src/back/air-pollution-stats.js");
const Datastore = require('nedb');



db_cancerdeaths_stats = new Datastore();
db_esco_stats = new Datastore();
db_airpollution_stats = new Datastore();


cancerdeaths_stats_API.register(app,db_cancerdeaths_stats);
esco_stats_API.register(app,db_esco_stats);
airpollution_stats_API.register(app,db_airpollution_stats);

app.use("/", express.static(`public`))

app.get("/cool", (req,res)=>{
    console.log("Requested /cool route");
    res.send("<html><body><h1>" + cool()+ "</h1></body></html>")
});

app.listen(port, ()=>{
    console.log(`Server ready at port ${port}`);
});




