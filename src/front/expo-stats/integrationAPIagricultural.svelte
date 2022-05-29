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
            type: "bar",
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
                        backgroundColor: "FF00E8",
                        borderColor: "FF00E8",
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
    <h2>Integracion de API propia y API de Javi grupo 20</h2>
    <h4>Biblioteca: Chart.js</h4>
    <!--<button class="btn btn-primary hBack" type="button">Volver</button>
    <a href="/#/tennis" class="btn btn-primary hBack" role="button" >Volver</a> -->
    <a href="/#/agriculturalproduction-stats" class="btn btn-primary btn-lg active" role="button" aria-pressed="true">Volver</a>

    <canvas id="myChart" />

</main>

<style>
    h2 {
        text-align: center;
    }
    h4 {
        text-align: center;
    }
</style>