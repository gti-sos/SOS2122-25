const cool = require("cool-ascii-faces");
const express = require("express");
const bodyParser = require("body-parser")
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

const cancerdeaths_stats_API = require("./src/back/economies-stats.js");
const pneumonia_stats_API = require("./src/back/esco-stats.js");
const airpollution_stats_API = require("./src/back/air-pollution-stats.js");


const BASE_API_URL = "/api/v1/";



cancerdeaths_stats_API.register(app);
pneumonia_stats_API.register(app);
airpollution_stats_API.register(app);

app.use("/", express.static(`public`))

app.get("/cool", (req,res)=>{
    console.log("Requested /cool route");
    res.send("<html><body><h1>" + cool()+ "</h1></body></html>")
});

app.listen(port, ()=>{
    console.log(`Server ready at port ${port}`);
});
