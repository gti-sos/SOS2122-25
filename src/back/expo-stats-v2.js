const { Pagination } = require("sveltestrap");

const BASE_API_URL_EXPO = "/api/v2/expo";
const API_DOC_PORTAL = "https://documenter.getpostman.com/view/20003647/UVyoVdQm";

var expo = [
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
     },
     {
        country: "madagascar",
        year: 2019,
        expo_tec: 0.366,
        expo_m: 27.509,
        expo_bys: 28.424
     },
     {
        country: "greece",
        year: 2019,
        expo_tec: 12.515,
        expo_m: 37.505,
        expo_bys: 40.132
     },
     {
        country: "morocco",
        year: 2019,
        expo_tec: 4.898,
        expo_m: 70.847,
        expo_bys: 39.317
     }

];

var Debtexpo = expo;

module.exports.register = (app,db) => {

//DOCUMENTACION DE LA API

app.get(BASE_API_URL_EXPO+"/docs",(req,res)=>{
    res.redirect(API_DOC_PORTAL);
});

//LOAD INITIAL DATA

app.get(BASE_API_URL_EXPO + "/loadInitialData", (req, res) => {

    db.find({}, function (err, filteredList) {
        if (err) {
            res.sendStatus(500, "CLIENT ERROR");
            return;
        }
        if (filteredList == 0) {
            for (var i = 0; i < expo.length; i++) {
                db.insert(expo[i]);
            }
            res.sendStatus(200, "OK: datos inicializados correctamente.");
            return;
        }else{
        res.sendStatus(200, "Aviso: datos ya inicializados anteriormente")
    }
    });
})

//GET GENERAL

app.get(BASE_API_URL_EXPO, (req, res) => {

    var year = req.query.year;
    var from = req.query.from;
    var to = req.query.to;

    //Comprobamos query
    for (var i = 0; i < Object.keys(req.query).length; i++) {
        var element = Object.keys(req.query)[i];
        if (element != "year" && element != "from" && element != "to" && element != "limit" && element != "offset") {
            res.sendStatus(400, "BAD REQUEST");
            return;
        }
    }

    //Comprobamos si from es mas pequeño o igual a to
    if (from > to) {
        res.sendStatus(400, "BAD REQUEST");
        return;
    }
    db.find({}, function (err, filteredList) {
        if (err) {
            res.sendStatus(500, "CLIENT ERROR");
            return;
        }

        // Búsqueda por año
        if (year != null) {
            var filteredList = filteredList.filter((reg) => {
                return (reg.year == year);
            });
            if (filteredList == 0) {
                res.sendStatus(404, "NOT FOUND");
                return;
            }
        }


        // From y To
        if (from != null && to != null) {
            filteredList = filteredList.filter((reg) => {
                return (reg.year >= from && reg.year <= to);
            });

            if (filteredList == 0) {
                res.sendStatus(404, "NOT FOUND");
                return;
            }
        }

        // Resultado sin ID
        if (req.query.limit != undefined || req.query.offset != undefined) {

            filteredList = Paginacion(req, filteredList);

        }
        filteredList.forEach((element) => {
            delete element._id;
        });

        //Comprobamos fields
        if(req.query.fields!=null){
            //Comprobamos si los campos son correctos
            var listaFields = req.query.fields.split(",");
            for(var i = 0; i<listaFields.length;i++){
                var element = listaFields[i];
                if(element != "country" && element != "year"){
                    res.sendStatus(400, "BAD REQUEST");
                    return;
                }
            }
            //Escogemos los campos correspondientes
            filteredList = checkFields(req,filteredList);
        }
        res.send(JSON.stringify(filteredList, null, 2));
    })
})

//GET DE UN RECURSO CONCRETO

app.get(BASE_API_URL_EXPO + "/:country/:year", (req, res) => {

    var country = req.params.country
    var year = req.params.year

    db.find({}, function (err, filteredList) {
        if (err) {
            res.sendStatus(500, "ERROR EN CLIENTE");
            return;
        }
        filteredList = filteredList.filter((reg) => {
            return (reg.country == country && reg.year == year);
        });
        if (filteredList == 0) {
            res.sendStatus(404, "NOT FOUND");
            return;
        }

        //RESULTADO

        //Paginación
        if (req.query.limit != undefined || req.query.offset != undefined) {
            filteredList = Paginacion(req, filteredList);
            res.send(JSON.stringify(filteredList, null, 2));
        }
        filteredList.forEach((element) => {
            delete element._id;
        });
        //Comprobamos fields
        if(req.query.fields!=null){
            //Comprobamos si los campos son correctos
            var listaFields = req.query.fields.split(",");
            for(var i = 0; i<listaFields.length;i++){
                var element = listaFields[i];
                if(element != "country" && element != "year" && element != "expo_tec"  && element != "expo_m" && element != "expo_bys"){
                    res.sendStatus(400, "BAD REQUEST");
                    return;
                }
            }
            //Escogemos los fields correspondientes
            filteredList = checkFields(req,filteredList);
        }
        res.send(JSON.stringify(filteredList[0], null, 2));
    });
})

app.get(BASE_API_URL_EXPO + "/:country/", (req, res) => {

    var country = req.params.country

    db.find({}, function (err, filteredList) {
        if (err) {
            res.sendStatus(500, "ERROR EN CLIENTE");
            return;
        }
        filteredList = filteredList.filter((reg) => {
            return (reg.country == country);
        });
        if (filteredList == 0) {
            res.sendStatus(404, "NOT FOUND");
            return;
        }

        //RESULTADO

        //Paginación
        if (req.query.limit != undefined || req.query.offset != undefined) {
            filteredList = Paginacion(req, filteredList);
            res.send(JSON.stringify(filteredList, null, 2));
        }
        filteredList.forEach((element) => {
            delete element._id;
        });
        //Comprobamos fields
        if(req.query.fields!=null){
            //Comprobamos si los campos son correctos
            var listaFields = req.query.fields.split(",");
            for(var i = 0; i<listaFields.length;i++){
                var element = listaFields[i];
                if(element != "country" && element != "year" && element != "expo_tec"  && element != "expo_m" && element != "expo_bys"){
                    res.sendStatus(400, "BAD REQUEST");
                    return;
                }
            }
            //Escogemos los fields correspondientes
            filteredList = checkFields(req,filteredList);
        }
        res.send(JSON.stringify(filteredList[0], null, 2));
    });
})

//POST CORRECTO

app.post(BASE_API_URL_EXPO, (req, res) => {

    if (checkBody(req)) {
        res.sendStatus(400, "BAD REQUEST");
    } else {
        db.find({}, function (err, filteredList) {

            if (err) {
                res.sendStatus(500, "CLIENT ERROR");
                return;
            }

            filteredList = filteredList.filter((reg) => {
                return (req.body.country == reg.country && req.body.year == reg.year)
            })

            if (filteredList.length != 0) {
                res.sendStatus(409, "CONFLICT");
            } else {
                db.insert(req.body);
                res.sendStatus(201, "CREATED");
            }
        })
    }
})

//POST NO PERMITIDO

app.post(BASE_API_URL_EXPO +"/:country/:year", (req,res) => {
    res.sendStatus(405,"METHOD NOT ALLOWED");
});

//PUT CORRECTO

app.put(BASE_API_URL_EXPO + "/:country/:year", (req, res) => {

    //comprobamos body
    if (checkBody(req)) {
        res.sendStatus(400, "BAD REQUEST");
        return;
    }

    var countryR = req.params.country;
    var yearR = req.params.year;
    var body = req.body;

    db.find({}, function (err, filteredList) {
        if (err) {
            res.sendStatus(500, "CLIENT ERROR");
            return;
        }

        //¿Existe el elemento?
        filteredList = filteredList.filter((reg) => {
            return (reg.country == countryR && reg.year == yearR);
        });
        if (filteredList == 0) {
            res.sendStatus(404, "NOT FOUND");
            return;
        }

        //comprobamos que los campos coincidan
        if (countryR != body.country || yearR != body.year) {
            res.sendStatus(400, "BAD REQUEST");
            return;
        }

        //actualizamos valor
        db.update({$and:[{country: String(countryR)}, {year: parseInt(yearR)}]}, {$set: body}, {},function(err, numUpdated) {
            if (err) {
                res.sendStatus(500, "ERROR EN CLIENTE");
            }else{
                res.sendStatus(200,"UPDATED");
            }
        });
    })
})

//PUT NO PERMITIDO

app.put(BASE_API_URL_EXPO, (req,res) => {
    res.sendStatus(405,"METHOD NOT ALLOWED");
});

//DELETE GENERAL

app.delete(BASE_API_URL_EXPO,(req, res)=>{
    db.remove({}, { multi: true }, (err, numRemoved)=>{
        if (err){
            res.sendStatus(500,"ERROR EN CLIENTE");
            return;
        }
        res.sendStatus(200,"DELETED");
        return;
    });
})

//DELETE DE UN RECURSO CONCRETO

app.delete(BASE_API_URL_EXPO+"/:country/:year",(req, res)=>{
    var countryR = req.params.country;
    var yearR = req.params.year;

    db.find({country: countryR, year: parseInt(yearR)}, {}, (err, filteredList)=>{
        if (err){
            res.sendStatus(500,"ERROR EN CLIENTE");
            return;
        }
        if(filteredList==0){
            res.sendStatus(404,"NOT FOUND");
            return;
        }
        db.remove({country: countryR, year: parseInt(yearR)}, {}, (err, numRemoved)=>{
            if (err){
                res.sendStatus(500,"ERROR EN CLIENTE");
                return;
            }            
            res.sendStatus(200,"DELETED");
            return;                
        });
    });
})

//FUNCION DE FILTRADO

function filterQuery(req,stats){
    filteredStats = stats.filter((stat)=>{
        
        var flag = true;

        if(req.query.year != undefined) {
            if(stat.year != req.query.year)  {
                flag = false;
            }
        }
        if(req.query.country != undefined) {
            if(stat.country != req.query.country)  {
                flag = false;
            }
        }
        if(req.query.expo_tec != undefined) {
            if(stat.expo_tec != req.query.expo_tec)  {
                flag = false;
            }
        }
        if(req.query.expo_m != undefined) {
            if(stat.expo_m != req.query.expo_m)  {
                flag = false;
            }
        }
        if(req.query.expo_bys != undefined) {
            if(stat.expo_bys != req.query.expo_bys)  {
                flag = false;
            }
        }
        return flag  
    });
    return filteredStats;
}

//FUNCION DE PAGINACION

function paginacion(req, list){
    var res = [];
    var limit = req.query.limit;
    var offset = req.query.offset;
    
    if(limit < 1 || offset < 0 || offset > list.length){
        res.push("ERROR EN PARAMETROS LIMIT Y/O OFFSET");
        return res;
    }

    //limit no definido
    if(limit == undefined && offset != undefined){
        limit = list.length - offset;
    }
    //offset no definido
    else if(limit != undefined && offset == undefined){
        offset = 0;
    }

    res = list.slice(offset,parseInt(limit)+parseInt(offset));
    return res;
}

//FUNCION PARA COMPROBAR LOS CAMPOS DE PETICION

function checkBody(req) {
    return (req.body.country == null |
        req.body.year == null |
        req.body.expo_tec == null |
        req.body.expo_m == null |
        req.body.expo_bys == null
    );
}

//FUNCION PARA COMPROBAR LOS CAMPOS DEL OBJETO

function checkFields(req, lista){
    var fields = req.query.fields;
    var hasCountry = false;
    var hasYear = false;
    var hasexpo_tec = false;
    var hasexpo_m = false;
    var hasexpo_bys = false;
    fields = fields.split(",");

    for(var i = 0; i<fields.length;i++){
        var element = fields[i];
        if(element=='country'){
            hasCountry=true;
        }
        if(element=='year'){
            hasYear=true;
        }
        if(element=='expo_tec'){
            hasexpo_tec=true;
        }
        if(element=='expo_m'){
            hasexpo_m=true;
        }
        if(element=='expo_bys'){
            hasexpo_bys=true;
        }
    }

    //Country
    if(!hasCountry){
        lista.forEach((element)=>{
            delete element.country;
        })
    }

    //Year
    if(!hasYear){
        lista.forEach((element)=>{
            delete element.year;
        })
    }

    //esco_men
    if(!hasexpo_m){
        lista.forEach((element)=>{
            delete element.expo_m;
        })
    }

    //esco_wom
    if(!hasexpo_bys){
        lista.forEach((element)=>{
            delete element.expo_bys;
        })
    }

    //esco_tot
    if(!hasexpo_tec){
        lista.forEach((element)=>{
            delete element.expo_tec;
        })
    }

    return lista;

}

};