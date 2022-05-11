<script>
    import { onMount } from 'svelte';

   
    let airpollutions = [];
    let escos = [];
    let economies = [];

    let country= [];
    let year = [];
    let ages_seventy = [];
    let ages_fifty_seventy = [];
    let ages_zero_fifty = [];
    let percapita = [];
    let currency = [];
    let currentprices = [];
    let ages1 =[];
    let ages2=[];
    let ages3=[];
    async function getData(){
        const res1= await fetch("/api/v1/air-pollution-stats");
        const res2= await fetch("/api/v2/economies");
        const res3= await fetch("/api/v1/esco-stats");
        if(res1.ok && res2.ok && res3.ok){
            const data1 = await res1.json();
            const data3 = await res2.json();
            const data2 = await res3.json();
            airpollutions = data1;
            console.log("Recibido: "+airpollutions.length);
            //inicializamos los arrays para mostrar los datos
            airpollutions.forEach(airpollution => {
                country.push(airpollution.country+"-"+airpollution.year);
                year.push(airpollution.year);
                ages1.push(airpollution.ages_seventy+airpollution.ages_fifty_seventy+airpollution.ages_zero_fifty);
                ages_fifty_seventy.push(airpollution.ages_fifty_seventy);
                ages_zero_fifty.push(airpollution.ages_zero_fifty);   
            });
            escos=data2;
            console.log("Recibido: " + escos.length);
            escos.forEach(esco=>{
               // year.push(esco.year);
                //country.push(esco.country);
                ages_zero_fifty.push(esco.ages_zero_fifty);
                ages_fifty_seventy.push(esco.ages_fifty_seventy);
                ages2.push(esco.ages_seventy+esco.ages_fifty_seventy+esco.ages_zero_fifty);
                ages_seventy.push(esco.ages_seventy);
            });
            economies=data3;
            console.log("Recibido: " + economies.length);
            economies.forEach(economies=>{
                percapita.push(economies.percapita);
                currency.push(economies.currency);
                ages3.push(economies.percapita+economies.currency+economies.currentprices);
                currentprices.push(economies.currentprices);
            });


        }else{
            console.log("Error in request");
        }
    }

    async function loadGraph(){

        Highcharts.chart("container", {
        title: {
            text: "Solar Employment Growth by Sector, 2010-2016",
        },

        subtitle: {
            text: "Source: thesolarfoundation.com",
        },

        yAxis: {
            title: {
                text: "economia escolarizacion",
            },

        },

        xAxis: {
            title: {
                text: "Pais-año",
            },categories: country,
        },

        legend: {
            layout: "vertical",
            align: "right",
            verticalAlign: "middle",
        },

        

        series: [
        {
        name: 'AirPollution',
        data: ages1,
    },{
        name: 'esco',
        data: ages2,
    },{
        name: 'economies',
        data: ages3,
    },
    ],

        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 500,
                    },
                    chartOptions: {
                        legend: {
                            layout: "horizontal",
                            align: "center",
                            verticalAlign: "bottom",
                        },
                    },
                },
            ],
        },
    });

    }
   
    onMount(getData);
</script>
<svelte:head>


    <script src="https://code.highcharts.com/highcharts.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/series-label.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/exporting.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/export-data.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>

</svelte:head>

<main>

    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            Basic line chart showing trends in a dataset. This chart includes the
            <code>series-label</code> module, which adds a label to each line for
            enhanced readability.
        </p>
    </figure>

</main>
