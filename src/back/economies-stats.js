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
    {
        country: "marroco",
        year: 2019,
        percapita: -332,
        currency: 1668.3,
        currentprices:6484
    },
    {
        country: "greece",
        year: 2019,
        percapita: 91,
        currency: 147.768,
        currentprices:1683
    }
 
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
                },
                {
                    country: "marroco",
                    year: 2019,
                    percapita: -332,
                    currency: 1668.3,
                    currentprices:6484
                },
                {
                    country: "greece",
                    year: 2019,
                    percapita: 91,
                    currency: 147.768,
                    currentprices:1683
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

    app.get(BASE_API_URL_ECO+"?year=:yearParam",(req,res)=>{
        filteredList = economies.filter((stat)=>{
            return (stat.year === parseInt(req.params.yearParam));
        })
        if(filteredList === 0){
            res.sendStatus(404,"NOT FOUND");
        }else{
            res.send(JSON.stringify(filteredList, null, 2));
        } 
    });

    //BUSQUEDA POR PAIS
    
    app.get(BASE_API_URL_ECO+"?country=:countryParam",(req,res)=>{
        filteredList = economies.filter((stat)=>{
            return (stat.country === req.params.countryParam);
        })
        if(filteredList === 0){
            res.sendStatus(404,"NOT FOUND");
        }else{
            res.send(JSON.stringify(filteredList, null, 2));
        } 
    });
    
    
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

    
    app.put(BASE_API_URL_ECO +"/:country/:year", (req,res) => {

        //comprobamos que los parametros del req existan
        if(
            Object.keys(req.body).length != 5 ||
            req.body.country == null ||
            req.body.year == null ||
            req.body.percapita == null ||
            req.body.currency == null ||
            req.body.currentprices == null
        ){ 
            res.sendStatus(400,"BAD REQUEST");  
        }else{
            existsEconomy = economies.filter((stat)=>{
                return (
                    stat.country == req.params.country && 
                    stat.year == req.params.year
                    );
            })
    
            var indice = economies.indexOf(existsEconomy[0]);
    
            if(existsEconomy.length == 0){
                res.sendStatus(404,"NOT FOUND");
            }
            else{
                economies[indice].currency = req.body.currency;
                economies[indice].currentprices = req.body.currentprices;
                economies[indice].percapita = req.body.percapita;
                res.sendStatus(200,"OK");
            }
        }   
        });
    
    
    app.delete(BASE_API_URL_ECO,(req, res)=>{
        economies = [];
        res.sendStatus(200,"DELETED");
    })
    
    
    
    app.delete(BASE_API_URL_ECO + "/:country/:year",(req,res)=>{
        economies = economies.filter((stat)=>{
            return (stat.country != req.params.country || stat.year != req.params.year);
        })
        res.sendStatus(200,"OK");
    
    });

    function pagination(req, lista) {
        var res = [];
        const limit = req.query.limit;
        const offset = req.query.offset;
    
        if (limit < 1 || offset < 0 || offset > lista.length) {
          res.push("ERROR EN PARAMETROS LIMIT Y/O OFFSET");
          return res;
        }
    
        res = lista.slice(offset, parseInt(limit) + parseInt(offset));
        return res;
      }
    
      //GETs
    
      //GET Global y años
    
      app.get(BASE_API_URL_ECO, (req, res) => {
        var year = req.query.year;
        var from = req.query.from;
        var to = req.query.to;
    
        //Comprobaciones
        //Comprobacion query
    
        for (var i = 0; i < Object.keys(req.query).length; i++) {
          var element = Object.keys(req.query)[i];
          if (
            element != "year" &&
            element != "from" &&
            element != "to" &&
            element != "limit" &&
            element != "offset"
          ) {
            res.sendStatus(400, "BAD REQUEST");
          }
        }
    
        //Comprobacion from menor que to
    
        if (from > to) {
          res.sendStatus(400, "BAD REQUEST");
        }
    
        db.find({}, function (err, filteredList) {
    
          // Apartado para búsqueda por año
    
          if (year != null) {
            var filteredList = economies.filter((reg) => {
              return reg.year == year;
            });
            if (filteredList == 0) {
              res.sendStatus(404, "NOT FOUND");
            }
          }
    
          // Apartado para from y to
    
          if (from != null && to != null) {
            filteredList = filteredList.filter((reg) => {
              return reg.year >= from && reg.year <= to;
            });
    
            if (filteredList == 0) {
              res.sendStatus(404, "NOT FOUND");
            }
          }
          // RESULTADO
    
          if (req.query.limit != undefined || req.query.offset != undefined) {
            filteredList = pagination(req, filteredList);
          }
          filteredList.forEach((element) => {
            delete element._id;
          });
          res.send(JSON.stringify(filteredList, null, 2));
        });
      });
    
    function comprobar_body(req){
        return (req.body.country == null |
                 req.body.year == null | 
                 req.body.percapita == null | 
                 req.body.currency == null | 
                 req.body.currentprices == null);
    }
}
