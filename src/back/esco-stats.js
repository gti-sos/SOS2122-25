//Angel Simon Mesa
const bodyParser = require("body-parser");

const BASE_API_URL_ESCO = "/api/v1/esco";



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
             }
    
]

module.exports.register = (app) =>{

    app.get(BASE_API_URL_ESCO+"/loadInitialData",(req, res)=>{
    
        if(esco.length==0){
            esco=[
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
             }
           ]
        }
        res.sendStatus(200, "OK.")
        
    })
    
    // Documentos
    
    app.get(
        +"/docs",(req,res)=>
    {
        res.redirect("https://documenter.getpostman.com/view/19481634/UVyoUx9L")
    })
    
    
    app.get(BASE_API_URL_ESCO,(req, res)=>{
    
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
    
    
    
    app.get(BASE_API_URL_ESCO+"/:country",(req, res)=>{
    
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
    
    
    app.get(BASE_API_URL_ESCO+"/:country/:year",(req, res)=>{
    
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
    
    
    
    app.post(BASE_API_URL_ESCO,(req, res)=>{
        
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
    
    
    
    app.post(BASE_API_URL_ESCO+"/:country",(req, res)=>{
        res.sendStatus(405,"METHOD NOT ALLOWED");
    })
    
    
    app.put(BASE_API_URL_ESCO,(req, res)=>{
        
        res.sendStatus(405,"METHOD NOT ALLOWED");
    })
    
    
    app.put(BASE_API_URL_ESCO+"/:country/:year",(req, res)=>{
        
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
                var  update_air_pollution_stats = {...body};
                esco[index] = update_esco;
            
                res.sendStatus(200,"UPDATED");
            }
        }
    
    })
    
    
    app.delete(BASE_API_URL_ESCO,(req, res)=>{
        esco = [];
        res.sendStatus(200,"DELETED");
    })
    
    
    
    app.delete(BASE_API_URL_ESCO+"/:country/:year",(req, res)=>{
        var country = req.params.country;
        var year = req.params.year;
        esco = esco.filter((reg)=>{
            return (reg.country!=country || (reg.country == country && reg.year != year))
        })
        res.sendStatus(200,"DELETED");
    })
    
    function comprobar_body(req){
        return (req.body.country == null |
                 req.body.year == null | 
                 req.body.esco_tot == null | 
                 req.body.esco_man == null | 
                 req.body.esco_wom == null);
    }
}
