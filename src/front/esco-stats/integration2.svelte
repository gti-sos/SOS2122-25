<script>

    import { onMount } from 'svelte';
    import * as c3 from "c3";
    import {Table,Button} from 'sveltestrap';
    import {pop} from 'svelte-spa-router';
    let apiData = {};
    const delay = ms => new Promise(res => setTimeout(res,ms));
        let stats = [];
        let stats1=[];
        let country= [];
        let year = [];
        let tot_wom = ["tot_wom"];
        let tot_man = ["tot_man"];
        let tot_esco = ["tot_esco"]; 
        let coefficients =["coefficients"];
        let educations =["educations"];
        let lifes =["lifes"];
        async function getData(){
            console.log("Fetching stats....");
            const res = await fetch("api/v1/esco-stats");
            const res1= await fetch("/remoteAPI2-esco")
            if(res.ok&&res1.ok){
                const data = await res.json();
                const data1= await res1.json();
                stats = data;
                console.log("Estadísticas recibidas: "+stats.length);
                //inicializamos los arrays para mostrar los datos
                stats.forEach(stat => {
                    country.push(stat.country+"-"+stat.year);
                    
                    tot_wom.push(stat.tot_wom);
                    tot_man.push(stat.tot_man);
                    tot_esco.push(stat.tot_esco);
                              
                });
                stats1 = data1;
                console.log("Estadísticas recibidas: "+stats1.length);
                //inicializamos los arrays para mostrar los datos
                stats1.forEach(stat => {
                    country.push(stat.country+"-"+stat.year);
              
                    coefficients.push(stat.coefficients);
                    educations.push(stat.educations);
                    lifes.push(stat.lifes); 
                });
            }else{
                console.log("Error cargando los datos");
            }
            loadGraph();
            console.log("Comprobando");
        }
             

    async function loadGraph(){
    
    
            var chart= c3.generate({
                bindto: '#chart',
    data: {
        
        columns: [
           tot_wom,
           tot_man,
           tot_esco,
           coefficients,
           educations,
           lifes,
           
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
           

       
    onMount(getData);
    </script>
    <svelte:head>
    
        <!-- Load c3.css -->
        <link rel="stylesheet" href="./c3/c3.css"  >

        
    
    </svelte:head>
    
    <main>
    
            <div id="chart"></div>
           
          
        <Button on:click="{pop}">
            Volver
        </Button>
    </main>
