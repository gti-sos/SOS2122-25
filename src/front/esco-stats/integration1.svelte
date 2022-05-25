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
      let public_expenditure = ["public_expenditure"];
      let pe_to_gdp = ["pe_to_gdp"];
      let pe_on_defence = ["pe_on_defence"];

      async function loadGraph(){
          console.log("Fetching stats....");
          const res = await fetch("/remoteAPI-esco");
          if(res.ok){
              const data = await res.json();
              stats = data;
              console.log("Estadísticas recibidas: "+stats.length);
              //inicializamos los arrays para mostrar los datos
              stats.forEach(stat => {
                  country.push(stat.country+"-"+stat.year);
                  year.push(stat.year);
                  public_expenditure.push(stat.public_expenditure);
                  pe_to_gdp.push(stat.pe_to_gdp);
                  pe_on_defence.push(stat.pe_on_defence);            
              });
          }
          else{
              console.log("Error cargando los datos");
          }
          console.log("Comprobando");   
          var chart = c3.generate({
            bindto: '#chart',
            data: {
      
              columns: [
                public_expenditure,
                pe_to_gdp,
                pe_on_defence
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