<script>
    import {Nav,NavItem,NavLink} from "sveltestrap";
    let apiFootball = [];
    async function loadData(){
        const resDataSerie = await fetch("https://football98.p.rapidapi.com/liga/scorers", {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "football98.p.rapidapi.com",
                "x-rapidapi-key": "8ecc0bcdbamsh270bcd760cabf93p19d6c8jsn5685eda75872"
            }
        });
        
        let serie = await resDataSerie.json();
        serie.forEach(x => {
            let goals = parseInt(x.player_goals);
            apiFootball.push({name: x.player_name, value: goals});
        });
        console.log(apiFootball);
        loadGraph();
    }
    async function loadGraph() {
        Highcharts.chart('container', {
            chart: {
                type: 'packedbubble',
                height: '100%'
            },
            title: {
                text: 'Goleadores Liga Santander del año 2020'
            },
            tooltip: {
                useHTML: true,
                pointFormat: '<b>{point.name}:</b> {point.value} goles'
            },
            plotOptions: {
                packedbubble: {
                    minSize: '80%',
                    maxSize: '120%',
                    zMin: 0,
                    zMax: 1000,
                    layoutAlgorithm: {
                        splitSeries: false,
                        gravitationalConstant: 0.02
                    },
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}',
                        filter: {
                            property: 'y',
                            operator: '>',
                            value: 250
                        },
                        style: {
                            color: 'pink',
                            textOutline: 'none',
                            fontWeight: 'normal'
                        }
                    }
                }
            },
            series: [
                {
                    name: "Goleadores",
                    data: apiFootball,
                    tooltip: {
                        valueSuffix: ' '
                    }
                }
            ]
        });
    }
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-more.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadData}"></script> 
</svelte:head>

<main>
    <a href="/#/expo" class="btn btn-warning" role="button" aria-pressed="true">Atrás</a>
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            Gráfico con los goleadores de La Liga Santander la temporada pasada
        </p>
    </figure>
</main>

<style>
    .highcharts-figure {
        min-width: 320px; 
        max-width: 500px;
        margin: 1em auto;
    }
</style>