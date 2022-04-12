const express = require("express");
const bodyParser = require("body-parser")
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

const economies_stats_API = require("./src/back/economies-stats.js");



const BASE_API_URL = "/api/v1/";



economies_stats_API.register(app);


app.use("/", express.static("./public"));


app.listen(port, ()=>{
    console.log(`Server ready at port ${port}`);
});
