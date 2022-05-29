<script>
    import { onMount } from 'svelte';
    let apiData = {};
    const delay = ms => new Promise(res => setTimeout(res,ms));
        let stats = [];
        let stats1=[];
        let country= [];
        let tec = ["expo_tec"];
        let m = ["expo_m"];
        let bys = ["tot_esco"]; 
        let imp = [];
        let ex = [];
        let ba= [];
        async function getData(){
            console.log("Fetching stats....");
            const loaData = await fetch("https://sos2122-22.herokuapp.com/api/v2/trade-stats/loadInitialData");
            const res = await fetch("/api/v1/expo");
            const res1= await fetch("https://sos2122-22.herokuapp.com/api/v2/trade-stats")
            if(res.ok&&res1.ok){
                const data = await res.json();
                const data1= await res1.json();
                stats = data;
                console.log("Estadísticas recibidas: "+stats.length);
                //inicializamos los arrays para mostrar los datos
                stats.forEach(stat => {
                    country.push(stat.country+"-"+stat.year);
                    
                    tec.push(stat.expo_tec);
                    m.push(stat.expo_m);
                    bys.push(stat.tot_esco);
                    imp.push(0);
                    ex.push(0);
                    ba.push(0);
                              
                });
                stats1 = data1;
                console.log("Estadísticas recibidas: "+stats1.length);
                //inicializamos los arrays para mostrar los datos
                stats1.forEach(stat => {
                    country.push(stat.country+"-"+stat.year);
              
                    imp.push(stat.import);
                    ex.push(stat.export);
                    ba.push(stat.balance);
                    tec.push(0);
                    m.push(0);
                    bys.push(0);
                });
            }else{
                console.log("Error cargando los datos");
            }
            loadGraph();
            console.log("Comprobando");
        }
    async function loadGraph() {
        var ctx = document.getElementById("myChart").getContext("2d");
        var trace_olympic_gold_medals = new Chart(ctx, {
            type: "bar",
            data: {
                labels: country,
                datasets: [
                    {
                        label: "Exportaciones",
                        backgroundColor: "rgb(0, 128, 128)",
                        borderColor: "rgb(255, 255, 255)",
                        data: ex,
                    },
                    {
                        label: "Importaciones",
                        backgroundColor: "rgb(255, 0 ,0)",
                        borderColor: "rgb(255, 255, 255)",
                        data: imp,
                    },
                    {
                        label: "Balance",
                        backgroundColor: "rgb(255, 255, 0)",
                        borderColor: "rgb(255, 255, 255)",
                        data: ba,
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
            options: {},
        });
       
       
    }
    onMount(getData);
</script>

<svelte:head>
    <script
        src="https://cdn.jsdelivr.net/npm/chart.js"
        on:load={loadGraph}></script>
</svelte:head>

<main>
    <h2>Integracion de mi API con la API de Marco del Grupo22 mediante la biblioteca Chart.js</h2>
    <a href="/#/expo" class="btn btn-warning" role="button" aria-pressed="true">Atrás</a>

    <canvas id="myChart" />

</main>

<style>
    h2 {
        text-align: center;
    }
</style>