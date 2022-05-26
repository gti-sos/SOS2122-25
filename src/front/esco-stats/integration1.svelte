<script>
  import { onMount } from 'svelte';
  import * as c3 from "c3";
  import * as d3 from "d3";
  import {Table,Button} from 'sveltestrap';
  import {pop} from 'svelte-spa-router';
  let apiData = {};
  const delay = ms => new Promise(res => setTimeout(res,ms));
      let stats = [];
      let stats_ex = [];
      let country= [];
      let year = [];
      let tot_wom = ["tot_wom"];
      let tot_man = ["tot_man"];
      let tot_esco = ["tot_esco"];
      let coefficients = ["coefficients"];
      let educations = ["educations"];
      let lifes = ["lifes"];

      async function loadGraph(){
          console.log("Fetching stats....");
          const res = await fetch("/api/v1/esco-stats");
          const res_ex = await fetch("https://sos2122-11.herokuapp.com/api/v2/inequality-stats");
          if(res.ok){
              const data = await res.json();
              stats = data;
              console.log("Estadísticas recibidas: "+stats.length);
              //inicializamos los arrays para mostrar los datos
              stats.forEach(stat => {
                  country.push(stat.country+"-"+stat.year);
                  year.push(stat.year);
                  tot_wom.push(stat.tot_wom);
                  tot_man.push(stat.tot_man);
                  tot_esco.push(stat.tot_esco);            
              });
          }
          else{
              console.log("Error cargando los datos");
          }
          
          if(res_ex.ok){
              const data_ex = await res_ex.json();
              stats_ex = data_ex;
              console.log("Estadísticas recibidas: "+stats_ex.length);
              //inicializamos los arrays para mostrar los datos
              stats_ex.forEach(stat_ex => {
                  country.push(stat_ex.country+"-"+stat_ex.year);
                  year.push(stat_ex.year);
                  coefficients.push(stat_ex.coefficients);
                  educations.push(stat_ex.educations);
                  lifes.push(stat_ex.lifes);            
              });
          }
          else{
              console.log("Error cargando los datos");
          }

          console.log("Comprobando");
                 
          var chart= c3.generate({
                bindto: '#chart',
    data: {
        
        columns: [
            tot_wom,
            tot_man,
            tot_esco
        ],
        type: 'spline'
    },
    axis:{
        x:{
            type:'category',
            categories:country
    
        }
        }
});

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