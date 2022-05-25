<script>
    import { onMount } from 'svelte';
    import "billboard.js/dist/theme/insight.css";
    import {Table,Button} from 'sveltestrap';
    import {pop} from 'svelte-spa-router';
    let apiData = {};
    const delay = ms => new Promise(res => setTimeout(res,ms));
        let stats = [];
        let country= [];
        let year = [];
        let coefficients = ["coefficients"];
        let educations = ["educations"];
        let lifes = ["lifes"]; 
        async function loadGraph(){
            console.log("Fetching stats....");
            const res = await fetch("/remoteAPI2");
            if(res.ok){
                const data = await res.json();
                stats = data;
                console.log("Estadísticas recibidas: "+stats.length);
                //inicializamos los arrays para mostrar los datos
                stats.forEach(stat => {
                    country.push(stat.country+"-"+stat.year);
                    year.push(stat.year);
                    coefficients.push(stat.coefficients);
                    educations.push(stat.educations);
                    lifes.push(stat.lifes);           
                });
            }else{
                console.log("Error cargando los datos");
            }
            console.log("Comprobando");
            await delay(500);
      
            var chart = bb.generate({
  data: {
    axis: {
    x: {
      type: "category"
    }
  },
    columns: [
	
    ],
   
    types: {
      coefficients: "area", // for ESM specify as: area()
      lifes: "area-spline",
      educations: "area-spline" // for ESM specify as: areaSpline()
    }
  },
  bindto: "#areaChart"
});
    
setTimeout(function() {
	chart.load({
		columns: [
			coefficients
		]
	});
}, 500);
setTimeout(function() {
	chart.load({
		columns: [
			lifes
		]
	});
}, 1000);
setTimeout(function() {
	chart.load({
		columns: [
			educations
		]
	});
}, 1500);
console.log(coefficients)
}
       
   onMount(loadGraph);
    </script>
    <svelte:head>
        <script src="https://d3js.org/d3.v6.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/billboard.js/3.4.1/billboard.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/billboard.js/3.4.1/billboard.min.css"></script>
        
    
    </svelte:head>
    
    <main>
    
            <div id="chart"></div>
           
          
        <Button on:click="{pop}">
            Volver
        </Button>
    </main>