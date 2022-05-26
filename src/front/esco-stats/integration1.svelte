<script>
  import { onMount } from 'svelte';
  import * as c3 from "c3";
  import * as d3 from "d3";
  import {Table,Button} from 'sveltestrap';
  import {pop} from 'svelte-spa-router';
  let apiData = {};
  const delay = ms => new Promise(res => setTimeout(res,ms));
      let stats = [];
      let country= [];
      let year = [];
      let ages_zero_fifty = ["ages_zero_fifty"];
      let ages_fifty_seventy = ["ages_fifty_seventy"];
      let ages_seventy = ["ages_seventy"];

      async function loadGraph(){
          console.log("Fetching stats....");
          const res = await fetch("https://sos2122-24.herokuapp.com/api/v1/air-pollution-stats");
          if(res.ok){
              const data = await res.json();
              stats = data;
              console.log("Estadísticas recibidas: "+stats.length);
              //inicializamos los arrays para mostrar los datos
              stats.forEach(stat => {
                  country.push(stat.country+"-"+stat.year);
                  year.push(stat.year);
                  ages_zero_fifty.push(stat.ages_zero_fifty);
                  ages_fifty_seventy.push(stat.ages_fifty_seventy);
                  ages_seventy.push(stat.ages_seventy);            
              });
          }
          else{
              console.log("Error cargando los datos");
          }
          console.log("Comprobando");
                 
          var chart = c3.generate({
    data: {
        columns: [
            ['data1', 30, 200, 100, 400, 150, 250],
            ['data2', 50, 20, 10, 40, 15, 25]
        ]
    }
});

setTimeout(function () {
    chart.load({
        columns: [
            ['data1', 230, 190, 300, 500, 300, 400]
        ]
    });
}, 1000);

setTimeout(function () {
    chart.load({
        columns: [
            ['data3', 130, 150, 200, 300, 200, 100]
        ]
    });
}, 1500);

setTimeout(function () {
    chart.unload({
        ids: 'data1'
    });
}, 2000);

        //}
      }
     
  //onMount(getData);
  </script>
  <svelte:head>
  
      <!-- Load c3.css -->
      <link rel="stylesheet" href="./c3/c3.css"  >
      <script type="text/javascript" src="./d3/dist/d3.js"  ></script>
      <script type="text/javascript" src="./c3/c3.js" on:load="{loadGraph}"></script>
      
  
  </svelte:head>
  
  <main>
  
          <div id="chart"></div>
         
        
      <Button on:click="{pop}">
          Volver
      </Button>
  </main>