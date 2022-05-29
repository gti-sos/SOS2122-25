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
        let prod = ["production"];
        let AbsC = ["absolute_change"];
        let RelC = ["relative_change"]; 
        async function getData(){
            console.log("Fetching stats....");
            const res = await fetch("/api/v1/expo");
            const res1= await fetch("/remoteAPI2")
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
                    prod.push(0);
                    AbsC.push(0);
                    RelC.push(0);
                              
                });
                stats1 = data1;
                console.log("Estadísticas recibidas: "+stats1.length);
                //inicializamos los arrays para mostrar los datos
                stats1.forEach(stat => {
                    country.push(stat.country+"-"+stat.year);
              
                    prod.push(stat.production);
                    AbsC.push(stat.absolute_change);
                    RelC.push(stat.relative_change);
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
            type: "radar",
            data: {
                labels: country,
                datasets: [
                    {

                        label: "Produccion",
                        backgroundColor: "pink",
                        borderColor: "pink",
                        data: prod,
                    },
                    {
                        label: "Cambio Absoluto",
                        backgroundColor: "#FFF700",
                        borderColor: "#FFF700",
                        data: AbsC,
                    },
                    {
                        label: "Cambio Relativo",
                        backgroundColor: "purple",
                        borderColor: "purple",
                        data: RelC,
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
                    plugins: {
                    filler: {
                        propagate: false
                    },
                    'samples-filler-analyser': {
                        target: 'chart-analyser'
                    }
                    },
                    interaction: {
                    intersect: false
                    }
            },
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
    <h2>Integracion de mi API con la API de Javier del Grupo20 mediante la biblioteca Chart.js</h2>
    <a href="/#/expo" class="btn btn-warning" role="button" aria-pressed="true">Atrás</a>

    <canvas id="myChart" />

</main>

<style>
    h2 {
        text-align: center;
    }
</style>