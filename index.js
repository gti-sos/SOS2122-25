const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

const BASE_API_URL = "/api/v1";
const api_doc_ASM = "https://docs.google.com/document/d/1_LHw0xnOvLafWNtNXzWkdP922CPShLoMHLHixCJYO9A/edit";

var esco=[
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

app.get(BASE_API_URL+"/esco/docs",(req,res)=>{
    res.redirect(api_doc_ASM);
});    

app.get(BASE_API_URL+"/esco",(req,res)=>{
    res.send(JSON.stringify(esco,null,2));
});

app.post(BASE_API_URL+"/esco",(req,res)=>{
    contacts.push(req.body);
    res.sendStatus(201,"CREATED");
});



app.listen(port, () => {
    console.log(`Server ready at port ${port}`);
});

