const bodyParser = require("body-parser");

const BASE_API_URL_EXPO = "/api/v1/expo";



var expo=[
    {
                country: "eeuu",
                year: 2019,
                expo_tec: 18.673,
                expo_m: 59.114,
                expo_bys: 11.758
            },
            {
                country: "spain",
                year: 2019,
                expo_tec: 6.846,
                expo_m: 66.650,
                expo_bys: 34.955
            },
            {
                country: "argentina",
                year: 2019,
                expo_tec: 5.213,
                expo_m: 16.555,
                expo_bys: 17.696
             }
    
]

module.exports.register = (app) =>{

    app.get(BASE_API_URL_EXPO+"/loadInitialData",(req, res)=>{
    
        if(expo.length==0){
            expo=[
            {
                country: "eeuu",
                year: 2019,
                expo_tec: 18.673,
                expo_m: 59.114,
                expo_bys: 11.758
            },
            {
                country: "spain",
                year: 2019,
                expo_tec: 6.846,
                expo_m: 66.650,
                expo_bys: 34.955
            },
            {
                country: "argentina",
                year: 2019,
                expo_tec: 5.213,
                expo_m: 16.555,
                expo_bys: 17.696
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
    
    
    app.get(BASE_API_URL_EXPO,(req, res)=>{
    
        var year = req.query.year;
        var from = req.query.from;
        var to = req.query.to;
        if(year != null){
            var filteredList = expo.filter((reg)=>
            {
                return (reg.year == year);
            });
            if (filteredList==0){
                res.sendStatus(404, "NO EXISTE ");
            }else{
                res.send(JSON.stringify(filteredList,null,2));
            }
        }else if(from != null && to != null){
            var filteredList = expo.filter((reg)=>
            {
                return (reg.year >= from && reg.year <=to);
            });
            if (filteredList==0){
                res.sendStatus(404, "NO EXISTE");
            }else{
                res.send(JSON.stringify(filteredList,null,2));
            }
    
        }else if(year == null && from == null && to == null){
            res.send(JSON.stringify(expo,null,2));
        }else{
            res.sendStatus(400, "BAD REQUEST");
        }
    })
    
    
    
    app.get(BASE_API_URL_EXPO+"/:country",(req, res)=>{
    
        var country =req.params.country
        var filteredList = expo.filter((reg)=>
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
    
    
    app.get(BASE_API_URL_EXPO+"/:country/:year",(req, res)=>{
    
        var country =req.params.country
        var year = req.params.year
        var filteredList = expo.filter((reg)=>
        {
            return (reg.country == country && reg.year == year);
        });
        if (filteredList==0){
            res.sendStatus(404, "NO EXISTE");
        }else{
            res.send(JSON.stringify(filteredList,null,2));
        }
    })
    
    
    
    app.post(BASE_API_URL_EXPO,(req, res)=>{
        
        if(comprobar_body(req)){
            res.sendStatus(400,"BAD REQUEST - Parametros incorrectos");
        }else{
            var filteredList = expo.filter((reg)=>
            {
                return(req.body.country == reg.country && req.body.year == reg.year)
            })
        
            if(filteredList.length != 0){
                res.sendStatus(409,"CONFLICT");
            }else{
                expo.push(req.body);
                res.sendStatus(201,"CREATED");
            }
        }
    
    })
    
    
    
    app.post(BASE_API_URL_EXPO+"/:country",(req, res)=>{
        res.sendStatus(405,"METHOD NOT ALLOWED");
    })
    
    
    app.put(BASE_API_URL_EXPO,(req, res)=>{
        
        res.sendStatus(405,"METHOD NOT ALLOWED");
    })
    
    
    app.put(BASE_API_URL_EXPO+"/:country/:year",(req, res)=>{
        
        if(comprobar_body(req)){
            res.sendStatus(400,"BAD REQUEST - Parametros incorrectos");
        }else{
            var country = req.params.country;
            var year = req.params.year;
            var body = req.body;  
            var index = expo.findIndex((reg) =>{
                return (reg.country == country && reg.year == year)
            })
            if(index == null){
                res.sendStatus(404,"NOT FOUND");
            }else if(country != body.country || year != body.year){
                res.sendStatus(400,"BAD REQUEST");
            }else{
                var  update_air_pollution_stats = {...body};
                expo[index] = update_expo;
            
                res.sendStatus(200,"UPDATED");
            }
        }
    
    })
    
    
    app.delete(BASE_API_URL_EXPO,(req, res)=>{
        expo = [];
        res.sendStatus(200,"DELETED");
    })
    
    
    
    app.delete(BASE_API_URL_EXPO+"/:country/:year",(req, res)=>{
        var country = req.params.country;
        var year = req.params.year;
        expo = expo.filter((reg)=>{
            return (reg.country!=country || (reg.country == country && reg.year != year))
        })
        res.sendStatus(200,"DELETED");
    })
    
    function comprobar_body(req){
        return (req.body.country == null |
                 req.body.year == null | 
                 req.body.expo_tec == null | 
                 req.body.expo_m == null | 
                 req.body.expo_bys == null);
    }
}

