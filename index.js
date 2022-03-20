const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

const BASE_API_URL = "/api/v1";
const api_doc = "https://docs.google.com/document/d/1my9fboOZnBnGUS0nW65O653r2NRP5Ol4Q2oFTw9MQpU/";

var economies=[
    {
        country: "eeuu",
        year: 2019,
        esco_tot: 102.5
    },
    {
        country: "spain",
        year: 2019,
        esco_tot: 100.7
    },
    {
        country: "argentina",
        year: 2019,
        esco_tot: 116.5
    },
    {
        country: "madagascar",
        year: 2019,
        esco_tot: 102.4
    },
 
];

app.get(BASE_API_URL+"/economies/docs",(req,res)=>{
    res.redirect(api_doc);
});    

app.get(BASE_API_URL+"/economies",(req,res)=>{
    res.send(JSON.stringify(economies,null,2));
});

app.post(BASE_API_URL+"/economies",(req,res)=>{
    contacts.push(req.body);
    res.sendStatus(201,"CREATED");
});



app.listen(port, () => {
    console.log(`Server ready at port ${port}`);
});

