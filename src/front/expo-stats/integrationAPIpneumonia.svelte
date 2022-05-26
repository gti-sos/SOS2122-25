<script>
import {onMount} from'svelte';
  
  let apiData = [];
  const delay = ms => new Promise(res => setTimeout(res, ms));
  async function getData(){
      const res = await fetch("/api/v1/expo");
      if (res.ok){
          const json = await res.json();
          console.log("datos cargados..."+JSON.stringify(json));
          apiData = json;
          guardaD1(json);
          const res1 = await fetch("https://sos2122-24.herokuapp.com/api/v2/pneumonia-stats");
          if (res1.ok){    
              const json2 = await res1.json();
              apiData = json2;
              guardaD(json2);
              console.log("cargando el grafo con los datos nuevos"+apiData);
              await delay(1000);
              loadGraph();
          
          }else{
              console.log("Error en la peticion de los datos iniciales para el grafico");
              
          }
  
  }else{
      console.log("Error en la peticion de los datos iniciales para el grafico");
          
  }
}
    let tec = [];
    let m = [];
    let bys = [];
    async function guardaD1(json){
        for(let i = 0; i<json.length; i++){
                let aux = [];
                aux.push(json[i].year);
                aux.push(json[i].expo_tec);
                tec.push(aux);
                aux = [];
                aux.push(json[i].year);
                aux.push(json[i].expo_m);
                m.push(aux);
                
                aux = [];
                aux.push(json[i].year);
                aux.push(json[i].tot_esco);
                bys.push(aux);
            }
    }
    let mas70 = [];
    let entre50y70 = [];
    let menos50 = [];
    async function guardaD(json){
        for(let i = 0; i<json.length; i++){
                let aux = [];
                aux.push(json[i].year);
                aux.push(json[i].ages_seventy);
                mas70.push(aux);
                aux = [];
                aux.push(json[i].year);
                aux.push(json[i].ages_fifty_seventy);
                entre50y70.push(aux);
                
                aux = [];
                aux.push(json[i].year);
                aux.push(json[i].ages_zero_fifty);
                menos50.push(aux);
            }
    }
    async function loadGraph(){
        Highcharts.chart('container', {
            chart: {
                type: 'areaspline'
            },
            title: {
                text: 'Integracion de los datos de pneumonía'
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 150,
                y: 100,
                floating: true,
                borderWidth: 1,
                backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
            },
            xAxis: {
                accessibility: {
                    title :{
                        text:'año'
                    }
                
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    },
                    pointStart: 2017
                }
            },
            yAxis: {
                title: {
                    text: 'Values'
                }
            },
            tooltip: {
                shared: true,
                valueSuffix: ' units'
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                areaspline: {
                    fillOpacity: 0.5
                }
            },
            series: [{
                name: 'Exportaciones Bienes y Servicios',
                data: bys
                },
                {
                name: 'Exportaciones Prod. Manufacturados',
                data: m
                },
                {
                name: 'Exportaciones Tecnológicas',
                data: tec
                },
                {
                name: 'Mayores de 70 años',
                data: mas70
                },
                {
                name: 'De 50 a 70 años',
                data: entre50y70
                },
                {
                name: 'Menores de 50 años',
                data: menos50
                }
                ]
        });
        
    }
    onMount(getData);
   
   
</script>
<main>
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            Using an area-splitline graph.
            Intregracion de la API de exportaciones y de la API Neumonía de Laura del grupo 24. 
            
        </p>
    </figure>

</main>

<svelte:head>

    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>

   

</svelte:head>