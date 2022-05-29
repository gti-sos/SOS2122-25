<script>
    import {onMount} from 'svelte';
    import{Nav, NavItem, NavLink } from "sveltestrap";
    const delay = ms => new Promise(res => setTimeout(res,ms));
    let covid = [];
    let country = [];
    let myChart;
    let TC = [];
    let Cases = [];
    let T= [];
    let tec = [];
    let m = [];
    let bys = [];
    let stats=[];
    let stats1=[];
    async function getCovid(){
        console.log("Fetching covid data...");
        const res1 = await fetch("/api/v1/expo");
        const res = await fetch("https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/npm-covid-data/europe", {
            "method" : "GET",
            "headers":{
                "x-rapidapi-host": "vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com",
                "x-rapidapi-key": "32c0b6eb01msh02d19df1210c431p103d4ajsn9d32192863d4",
            }
        });
        if(res.ok&&res1.ok){
            const data = await res.json();
            const data1 = await res1.json();
            stats = data;
            console.log("Estadísticas recibidas: "+stats.length);
            stats.forEach(stat => {
                country.push(stat.Country);
                TC.push(parseInt(stat["TotalCases"]));
                Cases.push(parseInt(stat["ActiveCases"]));
                T.push(parseInt(stat["TotalTests"]));
                tec.push(0);
                m.push(0);
                bys.push(0);
                
            });
            stats1=data1;
            console.log("Estadísticas recibidas: "+stats1.length);
            stats1.forEach(stat =>{
                country.push(stat.country);
                tec.push(stat["expo_tec"]);
                m.push(stat["expo_m"]);
                bys.push(stat["tot_esco"]);
                TC.push(0);
                Cases.push(0);
                T.push(0);
            })
        }
        else{
            console.log("Error");
        }
        loadGraph();
        console.log("Comprobando");
    }
    async function loadGraph() {
        var ctx = document.getElementById("myChart").getContext("2d");
        let myChart;
        if(myChart){
            myChart.destroy();
        }
        myChart = new Chart(ctx, {
            type: "radar",
            data: {
               labels: country,
                datasets: [
                    {
                        label: "Casos Activos",
                        backgroundColor: "pink",
                        borderColor: "pink",
                        data: Cases,
                    },
                    {
                        label: "Casos Totales",
                        backgroundColor: "yellow",
                        borderColor: "yellow",
                        data: TC,
                    },
                    {
                        label: "Numero de Tests",
                        backgroundColor: "purple",
                        borderColor: "purple",
                        data: T,
                    },
                    {
                        label: "Exportaciones Tecnológicas",
                        backgroundColor: "#0000FF",
                        borderColor: "#0000FF",
                        data: tec,
                    },
                    {
                        label: "Exportaciones Prod. Manufacturados",
                        backgroundColor: "#008000",
                        borderColor: "#008000",
                        data: m,
                    },
                    {
                        label: "Exportaciones Bienes y Servicios",
                        backgroundColor: "#ff8000",
                        borderColor: "#ff8000",
                        data: bys,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                }
            },
        });
       
       
    }
        
    onMount(getCovid);
</script>

<svelte:head>
    <script
        src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js"
        on:load={loadGraph}></script>
</svelte:head>

<main>
    <h2>Gráfica comparativa de los datos del COVID19 (API Externa) y las Exportaciones(Mi API)</h2>
    <a href="/#/info" class="btn btn-warning" role="button" aria-pressed="true">Atrás</a>

    <canvas id="myChart" />

</main>

<style>
    h2 {
        text-align: center;
    }
</style>