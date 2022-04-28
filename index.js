const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

const economies_stats_API = require("./src/back/economies-stats-v2.js");
const esco_stats_API = require("./src/back/esco-stats-v2.js");
const expo_stats_API = require("./src/back/expo-stats.js");

var Datastore = require("nedb");

ECO_DB = new Datastore();
ESCO_DB = new Datastore();




economies_stats_API.register(app,ECO_DB);
esco_stats_API.register(app,ESCO_DB);
expo_stats_API.register(app);

app.use("/api/v1/svelteExpo", express.static("./src/front/frontExpo/public"));
app.use("/api/v1/svelteEconomies", express.static("./src/front/frontEconomies/public"));
app.use("/api/v1/svelteEsco", express.static("./src/front/frontEsco/public"));

app.use("/",express.static("./public"));


app.listen(port, ()=>{
    console.log(`Server ready at port ${port}`);
});
