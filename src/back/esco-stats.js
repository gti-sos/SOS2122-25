//Angel Simon Mesa
const bodyParser = require("body-parser");

const BASE_API_URL_ESCO_STATS = "/api/v1/esco";



var esco=[
    {
                country: "eeuu",
                year: 2019,
                esco_tot: 102.5,
                esco_men: 102.1,
                esco_wom: 103
            },
            {
                country: "spain",
                year: 2019,
                esco_tot: 100.7,
                esco_men: 100,
                esco_wom: 101.5
            },
            {
                country: "argentina",
                year: 2019,
                esco_tot: 116.5,
                esco_men: 112.4,
                esco_wom: 120.8
             },
             {
                country: "pakistan",
                year: 2015,
                esco_tot: 100,
                esco_men: 101,
                esco_wom: 99
            },
            {
                country: "israel",
                year: 2019,
                esco_tot: 95,
                esco_men: 96.4,
                esco_wom: 93
            },
            {
                country: "italia",
                year: 2019,
                esco_tot: 115.5,
                esco_men: 111.4,
                esco_wom: 119.8
             }    
]
module.exports.register = (app) =>{

    app.get(BASE_API_URL_ESCO_STATS+"/loadInitialData",(req, res)=>{
    
        if(esco.length==0){
            esco = [
                {
                    country: "eeuu",
                    year: 2019,
                    esco_tot: 102.5,
                    esco_men: 102.1,
                    esco_wom: 103
                },
                {
                    country: "spain",
                    year: 2019,
                    esco_tot: 100.7,
                    esco_men: 100,
                    esco_wom: 101.5
                },
                {
                    country: "argentina",
                    year: 2019,
                    esco_tot: 116.5,
                    esco_men: 112.4,
                    esco_wom: 120.8
                 },
                 {
                    country: "pakistan",
                    year: 2015,
                    esco_tot: 100,
                    esco_men: 101,
                    esco_wom: 99
                },
                {
                    country: "israel",
                    year: 2019,
                    esco_tot: 95,
                    esco_men: 96.4,
                    esco_wom: 93
                },
                {
                    country: "italia",
                    year: 2019,
                    esco_tot: 115.5,
                    esco_men: 111.4,
                    esco_wom: 119.8
                 }  

            ]
        }
        res.sendStatus(200, "OK.")
        
    })
    
    // Documentos
    
    app.get(BASE_API_URL_ESCO_STATS+"/docs",(req,res)=>
    {
        res.redirect("https://documenter.getpostman.com/view/19516890/UVsSL2yS")
    })

    app.get(BASE_API_URL_ESCO_STATS+"?year=:yearParam",(req,res)=>{
        filteredList = esco.filter((stat)=>{
            return (stat.year === parseInt(req.params.yearParam));
        })
        if(filteredList === 0){
            res.sendStatus(404,"NOT FOUND");
        }else{
            res.send(JSON.stringify(filteredList, null, 2));
        } 
    });

    //BUSQUEDA POR PAIS
    
    app.get(BASE_API_URL_ESCO_STATS+"?country=:countryParam",(req,res)=>{
        filteredList = esco.filter((stat)=>{
            return (stat.country === req.params.countryParam);
        })
        if(filteredList === 0){
            res.sendStatus(404,"NOT FOUND");
        }else{
            res.send(JSON.stringify(filteredList, null, 2));
        } 
    });
    
    
    app.get(BASE_API_URL_ESCO_STATS,(req, res)=>{
    
        var year = req.query.year;
        var from = req.query.from;
        var to = req.query.to;
        if(year != null){
            var filteredList = esco.filter((reg)=>
            {
                return (reg.year == year);
            });
            if (filteredList==0){
                res.sendStatus(404, "NO EXISTE ");
            }else{
                res.send(JSON.stringify(filteredList,null,2));
            }
        }else if(from != null && to != null){
            var filteredList = esco.filter((reg)=>
            {
                return (reg.year >= from && reg.year <=to);
            });
            if (filteredList==0){
                res.sendStatus(404, "NO EXISTE");
            }else{
                res.send(JSON.stringify(filteredList,null,2));
            }
    
        }else if(year == null && from == null && to == null){
            res.send(JSON.stringify(esco,null,2));
        }else{
            res.sendStatus(400, "BAD REQUEST");
        }
    })
    
    
    
    app.get(BASE_API_URL_ESCO_STATS+"/:country",(req, res)=>{
    
        var country =req.params.country
        var filteredList = esco.filter((reg)=>
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
    
    
    app.get(BASE_API_URL_ESCO_STATS+"/:country/:year",(req, res)=>{
    
        var country =req.params.country
        var year = req.params.year
        var filteredList = esco.filter((reg)=>
        {
            return (reg.country == country && reg.year == year);
        });
        if (filteredList==0){
            res.sendStatus(404, "NO EXISTE");
        }else{
            res.send(JSON.stringify(filteredList,null,2));
        }
    })
    
    
    
    app.post(BASE_API_URL_ESCO_STATS,(req, res)=>{
        
        if(comprobar_body(req)){
            res.sendStatus(400,"BAD REQUEST - Parametros incorrectos");
        }else{
            var filteredList = esco.filter((reg)=>
            {
                return(req.body.country == reg.country && req.body.year == reg.year)
            })
        
            if(filteredList.length != 0){
                res.sendStatus(409,"CONFLICT");
            }else{
                esco.push(req.body);
                res.sendStatus(201,"CREATED");
            }
        }
    
    })
    
    
    
    app.post(BASE_API_URL_ESCO_STATS+"/:country",(req, res)=>{
        res.sendStatus(405,"METHOD NOT ALLOWED");
    })
    
    
    app.put(BASE_API_URL_ESCO_STATS,(req, res)=>{
        
        res.sendStatus(405,"METHOD NOT ALLOWED");
    })
    
    
    app.put(BASE_API_URL_ESCO_STATS+"/:country/:year",(req, res)=>{
        
        if(comprobar_body(req)){
            res.sendStatus(400,"BAD REQUEST - Parametros incorrectos");
        }else{
            var country = req.params.country;
            var year = req.params.year;
            var body = req.body;  
            var index = esco.findIndex((reg) =>{
                return (reg.country == country && reg.year == year)
            })
            if(index == null){
                res.sendStatus(404,"NOT FOUND");
            }else if(country != body.country || year != body.year){
                res.sendStatus(400,"BAD REQUEST");
            }else{
                var  update_esco = {...body};
                esco[index] = esco;
            
                res.sendStatus(200,"UPDATED");
            }
        }
    
    })
    
    
    app.delete(BASE_API_URL_ESCO_STATS,(req, res)=>{
        esco = [];
        res.sendStatus(200,"DELETED");
    })
    
    
    
    app.delete(BASE_API_URL_ESCO_STATS + "/:country/:year",(req,res)=>{
        esco = esco.filter((stat)=>{
            return (stat.country != req.params.country || stat.year != req.params.year);
        })
        res.sendStatus(200,"OK");
    
    });

    function paginationMaker(req, stats) {
        var res = [];
        const offset = req.query.offset;
        const limit = req.query.limit;
    
        if(limit < 0 || offset < 0 || offset > esco.length) {
            console.error(`Error in pagination, you have exceded limits`);
            res.push("ERROR");
            return res;	
        }
        const startIndex = offset;
        const endIndex = startIndex + limit;
    
        res = esco.slice(startIndex, endIndex);
        return res;
    }
    
    function comprobar_body(req){
        return (req.body.country == null |
                 req.body.year == null | 
                 req.body.esco_tot == null | 
                 req.body.esco_men == null | 
                 req.body.esco_wom == null);
    }
}
