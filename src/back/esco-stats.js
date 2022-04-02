//Alicia Campos Castello
const bodyParser = require("body-parser");

const BASE_API_URL_AIR_POLLUTION_STATS = "/api/v1/air-pollution-stats";



var air_pollution_stats = [
    {
        country: "france",
        year: 2019,
        ages_zero_fifty: 1,
        ages_fifty_seventy: 10,
        ages_seventy: 31
    },
    {
        country: "argentina",
        year: 2019,
        ages_zero_fifty: 57,
        ages_fifty_seventy: 197,
        ages_seventy: 457
    },
    {
        country: "brazil",
        year: 2019,
        ages_zero_fifty: 2083,
        ages_fifty_seventy: 4588,
        ages_seventy: 7346
    },
    {
        country: "china",
        year: 2019,
        ages_zero_fifty: 21535,
        ages_fifty_seventy: 104555,
        ages_seventy: 236938
    },
    {
        country: "japan",
        year: 2019,
        ages_zero_fifty: 2,
        ages_fifty_seventy: 16,
        ages_seventy: 85
    },
    {
        country: "england",
        year: 2019,
        ages_zero_fifty: 0,
        ages_fifty_seventy: 2,
        ages_seventy: 7
    },
    {
        country: "india",
        year: 2019,
        ages_zero_fifty: 118341,
        ages_fifty_seventy: 203713,
        ages_seventy: 284836

    },
    {
        country: "eeuu",
        year: 2019,
        ages_zero_fifty: 8,
        ages_fifty_seventy: 45,
        ages_seventy: 97
    },
    {
        country: "spain",
        year: 2019,
        ages_zero_fifty: 6,
        ages_fifty_seventy: 30,
        ages_seventy: 143
    }
]

module.exports.register = (app) =>{

    app.get(BASE_API_URL_AIR_POLLUTION_STATS+"/loadInitialData",(req, res)=>{
    
        if(air_pollution_stats.length==0){
            air_pollution_stats = [
                {
                    country: "france",
                    year: 2019,
                    ages_zero_fifty: 1,
                    ages_fifty_seventy: 10,
                    ages_seventy: 31
                },
                {
                    country: "argentina",
                    year: 2019,
                    ages_zero_fifty: 57,
                    ages_fifty_seventy: 197,
                    ages_seventy: 457
                },
                {
                    country: "brazil",
                    year: 2019,
                    ages_zero_fifty: 2083,
                    ages_fifty_seventy: 4588,
                    ages_seventy: 7346
                },
                {
                    country: "china",
                    year: 2019,
                    ages_zero_fifty: 21535,
                    ages_fifty_seventy: 104555,
                    ages_seventy: 236938
                },
                {
                    country: "japan",
                    year: 2019,
                    ages_zero_fifty: 2,
                    ages_fifty_seventy: 16,
                    ages_seventy: 85
                },
                {
                    country: "england",
                    year: 2019,
                    ages_zero_fifty: 0,
                    ages_fifty_seventy: 2,
                    ages_seventy: 7
                },
                {
                    country: "india",
                    year: 2019,
                    ages_zero_fifty: 118341,
                    ages_fifty_seventy: 203713,
                    ages_seventy: 284836
            
                },
                {
                    country: "eeuu",
                    year: 2019,
                    ages_zero_fifty: 8,
                    ages_fifty_seventy: 45,
                    ages_seventy: 97
                },
                {
                    country: "spain",
                    year: 2019,
                    ages_zero_fifty: 6,
                    ages_fifty_seventy: 30,
                    ages_seventy: 143
                }
            ]
        }
        res.sendStatus(200, "OK.")
        
    })
    
    // Documentos
    
    app.get(BASE_API_URL_AIR_POLLUTION_STATS+"/docs",(req,res)=>
    {
        res.redirect("https://documenter.getpostman.com/view/20219339/UVyn2Jne")
    })
    
    
    app.get(BASE_API_URL_AIR_POLLUTION_STATS,(req, res)=>{
    
        var year = req.query.year;
        var from = req.query.from;
        var to = req.query.to;
        if(year != null){
            var filteredList = air_pollution_stats.filter((reg)=>
            {
                return (reg.year == year);
            });
            if (filteredList==0){
                res.sendStatus(404, "NO EXISTE ");
            }else{
                res.send(JSON.stringify(filteredList,null,2));
            }
        }else if(from != null && to != null){
            var filteredList = air_pollution_stats.filter((reg)=>
            {
                return (reg.year >= from && reg.year <=to);
            });
            if (filteredList==0){
                res.sendStatus(404, "NO EXISTE");
            }else{
                res.send(JSON.stringify(filteredList,null,2));
            }
    
        }else if(year == null && from == null && to == null){
            res.send(JSON.stringify(air_pollution_stats,null,2));
        }else{
            res.sendStatus(400, "BAD REQUEST");
        }
    })
    
    
    
    app.get(BASE_API_URL_AIR_POLLUTION_STATS+"/:country",(req, res)=>{
    
        var country =req.params.country
        var filteredList = air_pollution_stats.filter((reg)=>
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
                res.send(JSON.stringify(filteredList,null,2));
            }
    
        }else{
            if (filteredList==0){
                res.sendStatus(404, "NO EXISTE");
            }else{
                res.send(JSON.stringify(filteredList,null,2));
            }
        }
    
    })
    
    
    app.get(BASE_API_URL_AIR_POLLUTION_STATS+"/:country/:year",(req, res)=>{
    
        var country =req.params.country
        var year = req.params.year
        var filteredList = air_pollution_stats.filter((reg)=>
        {
            return (reg.country == country && reg.year == year);
        });
        if (filteredList==0){
            res.sendStatus(404, "NO EXISTE");
        }else{
            res.send(JSON.stringify(filteredList,null,2));
        }
    })
    
    
    
    app.post(BASE_API_URL_AIR_POLLUTION_STATS,(req, res)=>{
        
        if(comprobar_body(req)){
            res.sendStatus(400,"BAD REQUEST - Parametros incorrectos");
        }else{
            var filteredList = air_pollution_stats.filter((reg)=>
            {
                return(req.body.country == reg.country && req.body.year == reg.year)
            })
        
            if(filteredList.length != 0){
                res.sendStatus(409,"CONFLICT");
            }else{
                air_pollution_stats.push(req.body);
                res.sendStatus(201,"CREATED");
            }
        }
    
    })
    
    
    
    app.post(BASE_API_URL_AIR_POLLUTION_STATS+"/:country",(req, res)=>{
        res.sendStatus(405,"METHOD NOT ALLOWED");
    })
    
    
    app.put(BASE_API_URL_AIR_POLLUTION_STATS,(req, res)=>{
        
        res.sendStatus(405,"METHOD NOT ALLOWED");
    })
    
    
    app.put(BASE_API_URL_AIR_POLLUTION_STATS+"/:country/:year",(req, res)=>{
        
        if(comprobar_body(req)){
            res.sendStatus(400,"BAD REQUEST - Parametros incorrectos");
        }else{
            var country = req.params.country;
            var year = req.params.year;
            var body = req.body;  
            var index = air_pollution_stats.findIndex((reg) =>{
                return (reg.country == country && reg.year == year)
            })
            if(index == null){
                res.sendStatus(404,"NOT FOUND");
            }else if(country != body.country || year != body.year){
                res.sendStatus(400,"BAD REQUEST");
            }else{
                var  update_air_pollution_stats = {...body};
                air_pollution_stats[index] = update_air_pollution_stats;
            
                res.sendStatus(200,"UPDATED");
            }
        }
    
    })
    
    
    app.delete(BASE_API_URL_AIR_POLLUTION_STATS,(req, res)=>{
        air_pollution_stats = [];
        res.sendStatus(200,"DELETED");
    })
    
    
    
    app.delete(BASE_API_URL_AIR_POLLUTION_STATS+"/:country/:year",(req, res)=>{
        var country = req.params.country;
        var year = req.params.year;
        air_pollution_stats = air_pollution_stats.filter((reg)=>{
            return (reg.country!=country || (reg.country == country && reg.year != year))
        })
        res.sendStatus(200,"DELETED");
    })
    
    function comprobar_body(req){
        return (req.body.country == null |
                 req.body.year == null | 
                 req.body.ages_zero_fifty == null | 
                 req.body.ages_fifty_seventy == null | 
                 req.body.ages_seventy == null);
    }
}
