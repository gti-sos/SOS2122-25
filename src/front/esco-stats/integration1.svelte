<script>
    import {onMount} from 'svelte';
    const delay = ms => new Promise(res => setTimeout(res,ms));
    let data = [];
    let cityName = "";
    let countryName = "";
    let years = [];
    let population = [];
    async function getData(){
        console.log("Fetching data....");
        const res = await fetch("/remoteApiV1");
        if(res.ok){
            const info = await res.json();
            //informacion de la ciudad de Insbruck
            data = info.data[116];
            cityName = data["city"];
            countryName = data["country"];
            
            data["populationCounts"].forEach(e => {
                years.push(e["year"]);
                population.push(e["value"]);
            });
            console.log("Data:", data);
            console.log("Poblacion de " + cityName + " en " + countryName);
            console.log("Años: ",years );
            console.log("Poblacion: ",population);
            //esperamos a que se carguen 
            await delay(500);
            loadGraph();
                  
        }else{
            console.log("Error cargando los datos");
		}
    }
    async function loadGraph(){
        var dataPlot = [
            {
                x: years,
                y: population,
                type: 'bar'
            }
        ];
        Plotly.newPlot('myDiv', dataPlot);
    }
    onMount(getData);
    
</script>

<head>
    <title>Timeline</title>
    <script type="text/javascript" src="https://unpkg.com/vis-timeline@latest/standalone/umd/vis-timeline-graph2d.min.js"></script>
    <link href="https://unpkg.com/vis-timeline@latest/styles/vis-timeline-graph2d.min.css" rel="stylesheet" type="text/css" />
    <style type="text/css">
      #visualization {
        width: 600px;
        height: 400px;
        border: 1px solid lightgray;
      }
    </style>
  </head>
  <body>
  <div id="visualization"></div>
  <script type="text/javascript">
    // DOM element where the Timeline will be attached
    var container = document.getElementById('visualization');
  
    // Create a DataSet (allows two way data-binding)
    var items = new vis.DataSet([
      {id: 1, content: 'item 1', start: '2014-04-20'},
      {id: 2, content: 'item 2', start: '2014-04-14'},
      {id: 3, content: 'item 3', start: '2014-04-18'},
      {id: 4, content: 'item 4', start: '2014-04-16', end: '2014-04-19'},
      {id: 5, content: 'item 5', start: '2014-04-25'},
      {id: 6, content: 'item 6', start: '2014-04-27', type: 'point'}
    ]);
  
    // Configuration for the Timeline
    var options = {};
  
    // Create a Timeline
    var timeline = new vis.Timeline(container, items, options);
  </script>
  </body>