const cool = require("cool-ascii-faces");
const express = require("express");
const bodyParser = require("body-parser")
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

const economies_stats_API = require("./src/back/economies-stats.js");
const esco_stats_API = require("./src/back/esco-stats.js");
const expo_stats_API = require("./src/back/expo-stats.js");



const BASE_API_URL = "/api/v1/";



economies_stats_API.register(app);
esco_stats_API.register(app);


app.use("/", express.static(`public`))

app.get("/cool", (req,res)=>{
    console.log("Requested /cool route");
    res.send("<html><body><h1>" + cool()+ "</h1></body></html>")
});

app.listen(port, ()=>{
    console.log(`Server ready at port ${port}`);
});
