const cool = require("cool-ascii-faces");
const express = require("express")

const app = express();
const port = process.env.PORT || 8080;

app.use("/",express.static('public'));

app.get("/faces",(req,res)=>{
    console.log("Requested / faces");
    res.send("<html><body><h1>"+cool()+"</h1></body></html>")
})

app.listen(port, () => {
    console.log('server ready at port ${port}');
})
