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
        let quantity = ["quantity"];
        let absolute_change = ["absolute_change"];
        let relative_change = ["relative_change"]; 
        async function loadGraph(){
            console.log("Fetching stats....");
            const res = await fetch("/remoteAPI");
            if(res.ok){
                const data = await res.json();
                stats = data;
                console.log("Estadísticas recibidas: "+stats.length);
                //inicializamos los arrays para mostrar los datos
                stats.forEach(stat => {
                    country.push(stat.country+"-"+stat.year);
                    year.push(stat.year);
                    quantity.push(stat.quantity);
                    absolute_change.push(stat.absolute_change);
                    relative_change.push(stat.relative_change);           
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
      quantity: "area", // for ESM specify as: area()
      relative_change: "area-spline",
      absolute_change: "area-spline" // for ESM specify as: areaSpline()
    }
  },
  bindto: "#areaChart"
});
    
setTimeout(function() {
	chart.load({
		columns: [
			quantity
		]
	});
}, 500);
setTimeout(function() {
	chart.load({
		columns: [
			relative_change
		]
	});
}, 1000);
setTimeout(function() {
	chart.load({
		columns: [
			absolute_change
		]
	});
}, 1500);
console.log(quantity)
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