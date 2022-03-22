const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;


const BASE_API_URL = "/api/v1";
//DAMIAN
const api_doc_DGC = "https://docs.google.com/document/d/1my9fboOZnBnGUS0nW65O653r2NRP5Ol4Q2oFTw9MQpU/";
//ANGEL
const api_doc_ASM = "https://docs.google.com/document/d/1_LHw0xnOvLafWNtNXzWkdP922CPShLoMHLHixCJYO9A/edit";

//ANGEL

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

//DAMIAN

var economies=[
    {
        country: "eeuu",
        year: 2019,
        percapita: 2.42,
        currency: 62.014,
        currentprices:217092
        
    },
    {
        country: "spain",
        year: 2019,
        percapita: 1.946,
        currency: 25269.988,
        currentprices:1247
        
    },
    {
        country: "argentina",
        year: 2019,
        percapita: -2391,
        currency: 14787.768,
        currentprices:20939
    },
 
];

app.use("/",express.static('public'));

//ANGEL

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
   
//DAMIAN

app.get(BASE_API_URL+"/economies/docs",(req,res)=>{
    res.redirect(api_doc_DGC);
});    

app.get(BASE_API_URL+"/economies",(req,res)=>{
    res.send(JSON.stringify(economies,null,2));
});

app.get(BASE_API_URL+"/economies/loadInicialData",(req,res)=>{
    res.send(JSON.stringify(economies,null,2));
});

app.post(BASE_API_URL+"/economies",(req,res)=>{
    economies.push(req.body);
    res.sendStatus(201,"CREATED");
});

app.get(BASE_API_URL+"/economies/:country",(req,res)=>{
    var countryName= req.params.country;
    filteredCountry = economies.filter((data)=>{
        return(data.country == countryName);
    });
 
    if(filteredCountry == 0){
        res.sendStatus(404,"NOT FOUND");
    }
    else{
        res.send(JSON.stringify(filteredCountry[0],null,2));
    }
});

app.get(BASE_API_URL+"/economies/:country",(req,res)=>{
    var countryName= req.params.country;
    filteredCountry = economies.filter((data)=>{
        return(data.country == countryName);
    });
 
    if(filteredCountry == 0){
        res.sendStatus(404,"NOT FOUND");
    }
    else{
        res.send(JSON.stringify(filteredCountry[0],null,2));
    }
});


app.get(BASE_API_URL+"/economies/:country/:year",(req,res)=>{
    var countryName= req.params.country;
    var yearSearch= req.params.year;
    filteredCountry = economies.filter((data)=>{
  	  if(data.country == countryName){
  	      return(data.year == yearSearch);
  	  }
    });
 
    if(yearSearch == 0){
        res.sendStatus(404,"NOT FOUND");
    }
    else{
        res.send(JSON.stringify(filteredCountry[0],null,2));
    }
});


app.delete(BASE_API_URL+"/economies",(req,res)=>{
    economies = [];
    res.sendStatus(200,"OK  ");
});

app.delete(BASE_API_URL+"/economies/:country",(req,res)=>{
    var countryName= req.params.country;
    economies = economies.filter((data)=>{
        return(data.country != countryName);
    });
 
    res.sendStatus(200,"OK");
});



app.listen(port, () => {
    console.log(`Server ready at port ${port}`);
});

