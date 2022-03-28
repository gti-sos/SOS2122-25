const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;


const BASE_API_URL = "/api/v1";
//DAMIAN
const api_doc_DGC = "https://documenter.getpostman.com/view/19516890/UVsSL2yS";
//ANGEL
const api_doc_ASM = "https://documenter.getpostman.com/view/19481634/UVyoUx9L";
//ADRIÁN
const api_doc_APG = "https://documenter.getpostman.com/view/20003647/UVyoVdQm";

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
    
];

//ADRIÁN

var expo=[
    {
        country: "eeuu",
        year: 2019,
        expo_tec: 18.673,
        expo_m: 59.114,
        expo_bys: 11.756,
    },
    {
        country: "spain",
        year: 2019,
        expo_tec: 6.846,
        expo_m: 66.650,
        expo_bys: 34.955,
    },
    {
        country: "argentina",
        year: 2019,
        expo_tec: 5.213,
        expo_m: 16.555,
        expo_bys: 17.696,
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

//ADRIÁN

app.get(BASE_API_URL+"/expo/docs",(req,res)=>{
    res.redirect(api_doc_APG);
});    

app.get(BASE_API_URL+"/expo",(req,res)=>{
    res.send(JSON.stringify(expo,null,2));
});

app.post(BASE_API_URL+"/expo",(req,res)=>{
    contacts.push(req.body);
    res.sendStatus(201,"CREATED");
});

app.get(BASE_API_URL+"/expo/:country",(req,res)=>{
    var countryName= req.params.country;
    filteredCountry = expo.filter((data)=>{
        return(data.country == countryName);
    });
 
    if(filteredCountry == 0){
        res.sendStatus(404,"NOT FOUND");
    }
    else{
        res.send(JSON.stringify(filteredCountry[0],null,2));
    }
});

app.get(BASE_API_URL+"/expo/:country",(req,res)=>{
    var countryName= req.params.country;
    filteredCountry = expo.filter((data)=>{
        return(data.country == countryName);
    });
 
    if(filteredCountry == 0){
        res.sendStatus(404,"NOT FOUND");
    }
    else{
        res.send(JSON.stringify(filteredCountry[0],null,2));
    }
});

app.put(BASE_API_URL+"/expo/",(req,res)=>{
    res.sendStatus(405,"METHOD NOT ALLOWED");
});

app.post(BASE_API_URL+"/expo/:country",(req,res)=>{
    res.sendStatus(409,"METHOD NOT ALLOWED");
});

app.get(BASE_API_URL+"/expo/:country/:year",(req,res)=>{
    var countryName= req.params.country;
    var yearSearch= req.params.year;
    filteredCountry = expo.filter((data)=>{
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


app.delete(BASE_API_URL+"/expo",(req,res)=>{
    expo = [];
    res.sendStatus(200,"OK  ");
});

app.delete(BASE_API_URL+"/expo/:country",(req,res)=>{
    var countryName= req.params.country;
    economies = expo.filter((data)=>{
        return(data.country != countryName);
    });
 
    res.sendStatus(200,"OK");
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

app.put(BASE_API_URL+"/economies/",(req,res)=>{
    res.sendStatus(405,"METHOD NOT ALLOWED");
});

app.post(BASE_API_URL+"/economies/:country",(req,res)=>{
    res.sendStatus(409,"METHOD NOT ALLOWED");
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

//ANGEL

app.get(BASE_API_URL+"/esco/:country",(req,res)=>{
    var countryName= req.params.country;
    filteredCountry = esco.filter((data)=>{
        return(data.country == countryName);
    });
 
    if(filteredCountry == 0){
        res.sendStatus(404,"NOT FOUND");
    }
    else{
        res.send(JSON.stringify(filteredCountry[0],null,2));
    }
});

app.get(BASE_API_URL+"/esco/:country",(req,res)=>{
    var countryName= req.params.country;
    filteredCountry = esco.filter((data)=>{
        return(data.country == countryName);
    });
 
    if(filteredCountry == 0){
        res.sendStatus(404,"NOT FOUND");
    }
    else{
        res.send(JSON.stringify(filteredCountry[0],null,2));
    }
});

app.put(BASE_API_URL+"/esco/",(req,res)=>{
    res.sendStatus(405,"METHOD NOT ALLOWED");
});

app.post(BASE_API_URL+"/esco/:country",(req,res)=>{
    res.sendStatus(409,"METHOD NOT ALLOWED");
});

app.get(BASE_API_URL+"/esco/:country/:year",(req,res)=>{
    var countryName= req.params.country;
    var yearSearch= req.params.year;
    filteredCountry = esco.filter((data)=>{
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


app.delete(BASE_API_URL+"/esco",(req,res)=>{
    esco = [];
    res.sendStatus(200,"OK  ");
});

app.delete(BASE_API_URL+"/esco/:country",(req,res)=>{
    var countryName= req.params.country;
    esco = esco.filter((data)=>{
        return(data.country != countryName);
    });
 
    res.sendStatus(200,"OK");
});


app.listen(port, () => {
    console.log(`Server ready at port ${port}`);
});

