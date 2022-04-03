const express = require("express");

const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;


const BASE_API_URL_ECO = "/api/v1/economies";



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

module.exports.register = (app) =>{

    app.get(BASE_API_URL_ECO+"/loadInitialData",(req, res)=>{
    
        if(economies.length==0){
            economies = [
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
                }
            ]
        }
        res.sendStatus(200, "OK.")
        
    })
    
    // Documentos
    
    app.get(BASE_API_URL_ECO+"/docs",(req,res)=>
    {
        res.redirect("https://documenter.getpostman.com/view/19516890/UVsSL2yS")
    })
    
    
    app.get(BASE_API_URL_ECO,(req, res)=>{
    
        var year = req.query.year;
        var from = req.query.from;
        var to = req.query.to;
        if(year != null){
            var filteredList = economies.filter((reg)=>
            {
                return (reg.year == year);
            });
            if (filteredList==0){
                res.sendStatus(404, "NO EXISTE ");
            }else{
                res.send(JSON.stringify(filteredList,null,2));
            }
        }else if(from != null && to != null){
            var filteredList = economies.filter((reg)=>
            {
                return (reg.year >= from && reg.year <=to);
            });
            if (filteredList==0){
                res.sendStatus(404, "NO EXISTE");
            }else{
                res.send(JSON.stringify(filteredList,null,2));
            }
    
        }else if(year == null && from == null && to == null){
            res.send(JSON.stringify(economies,null,2));
        }else{
            res.sendStatus(400, "BAD REQUEST");
        }
    })
    
    
    
    app.get(BASE_API_URL_ECO+"/:country",(req, res)=>{
    
        var country =req.params.country
        var filteredList = economies.filter((reg)=>
        {
            return (reg.country == country);
        });
    
        var from = req.query.from;
        var to = req.query.to;
    
        if(from != null && to != null){
            filteredList = filteredList.filter((reg)=>
            {
                return (reg.year >= from && reg.year <=to);
            });
            if (filteredList==0){
                res.sendStatus(404, "NO EXISTE");
            }else{
                res.send(JSON.stringify(filteredList[0],null,2));
            }
    
        }else{
            if (filteredList==0){
                res.sendStatus(404, "NO EXISTE");
            }else{
                res.send(JSON.stringify(filteredList[0],null,2));
            }
        }
    
    })
    
    
    app.get(BASE_API_URL_ECO+"/:country/:year",(req, res)=>{
    
        var country =req.params.country
        var year = req.params.year
        var filteredList = economies.filter((reg)=>
        {
            return (reg.country == country && reg.year == year);
        });
        if (filteredList==0){
            res.sendStatus(404, "NO EXISTE");
        }else{
            res.send(JSON.stringify(filteredList,null,2));
        }
    })
    
    
    
    app.post(BASE_API_URL_ECO,(req, res)=>{
        
        if(comprobar_body(req)){
            res.sendStatus(400,"BAD REQUEST - Parametros incorrectos");
        }else{
            var filteredList = economies.filter((reg)=>
            {
                return(req.body.country == reg.country && req.body.year == reg.year)
            })
        
            if(filteredList.length != 0){
                res.sendStatus(409,"CONFLICT");
            }else{
                economies.push(req.body);
                res.sendStatus(201,"CREATED");
            }
        }
    
    })
    
    
    
    app.post(BASE_API_URL_ECO+"/:country",(req, res)=>{
        res.sendStatus(405,"METHOD NOT ALLOWED");
    })
    
    
    app.put(BASE_API_URL_ECO,(req, res)=>{
        
        res.sendStatus(405,"METHOD NOT ALLOWED");
    })
    
    
    app.put(BASE_API_URL_ECO+"/:country/:year",(req, res)=>{
        
        if(comprobar_body(req)){
            res.sendStatus(400,"BAD REQUEST - Parametros incorrectos");
        }else{
            var country = req.params.country;
            var year = req.params.year;
            var body = req.body;  
            var index = economies.findIndex((reg) =>{
                return (reg.country == country && reg.year == year)
            })
            if(index == null){
                res.sendStatus(404,"NOT FOUND");
            }else if(country != body.country || year != body.year){
                res.sendStatus(400,"BAD REQUEST");
            }else{
                var  update_economies = {...body};
                economies[index] = economies;
            
                res.sendStatus(200,"UPDATED");
            }
        }
    
    })
    
    
    app.delete(BASE_API_URL_ECO,(req, res)=>{
        economies = [];
        res.sendStatus(200,"DELETED");
    })
    
    
    
    app.delete(BASE_API_URL+"/economies/:country",(req,res)=>{
        var countryName= req.params.country;
        economies = economies.filter((data)=>{
            return(data.country != countryName);
        });
 
        res.sendStatus(200,"OK");
    });
    
    function comprobar_body(req){
        return (req.body.country == null |
                 req.body.year == null | 
                 req.body.percapita == null | 
                 req.body.currency == null | 
                 req.body.currentprices == null);
    }
}
