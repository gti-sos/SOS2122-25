const cool = require("cool-ascii-faces");
const express = require("express");
const bodyParser = require("body-parser")
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

<<<<<<< HEAD
const economies_stats_API = require("./src/back/economies-stats-v2.js");
=======
const cancerdeaths_stats_API = require("./src/back/cancerdeaths-stats.js");
>>>>>>> 3fa2bfde40a647fabca91b7de0ce0784d8d9cf4a
const esco_stats_API = require("./src/back/esco-stats.js");
const airpollution_stats_API = require("./src/back/air-pollution-stats.js");
const Datastore = require('nedb');



<<<<<<< HEAD
db_economies_stats = new Datastore();
=======
db_cancerdeaths_stats = new Datastore();
>>>>>>> 3fa2bfde40a647fabca91b7de0ce0784d8d9cf4a
db_esco_stats = new Datastore();
db_airpollution_stats = new Datastore();


<<<<<<< HEAD
economies_stats_API.register(app,db_economies_stats);
=======
cancerdeaths_stats_API.register(app,db_cancerdeaths_stats);
>>>>>>> 3fa2bfde40a647fabca91b7de0ce0784d8d9cf4a
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




