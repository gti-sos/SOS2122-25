const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

const economies_stats_API = require("./src/back/economies-stats.js");
const esco_stats_API = require("./src/back/esco-stats.js");
const expo_stats_API = require("./src/back/expo-stats.js");


const BASE_API_URL = "/api/v1/";



economies_stats_API.register(app);
esco_stats_API.register(app);
expo_stats_API.register(app);

app.use("/api/v1/svelteExpo", express.static("./src/front/frontExpo/public"));
app.use("/api/v1/svelteEconomies", express.static("./src/front/frontEconomies/public"));
app.use("/api/v1/svelteEsco", express.static("./src/front/frontEsco/public"));

app.use("/",express.static("./public"));


app.listen(port, ()=>{
    console.log(`Server ready at port ${port}`);
});
