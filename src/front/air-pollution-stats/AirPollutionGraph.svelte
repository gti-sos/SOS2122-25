<script>

import { onMount } from 'svelte';
import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Button} from 'sveltestrap';

let apiData = {};

const delay = ms => new Promise(res => setTimeout(res,ms));
    let stats = [];
    let country= [];
    let year = [];
    let ages_seventy = [];
    let ages_fifty_seventy = [];
    let ages_zero_fifty = []; 
    async function getPEStats(){
        console.log("Fetching stats....");
        const res = await fetch("/api/v1/air-pollution-stats");
        if(res.ok){
            const data = await res.json();
            stats = data;
            console.log("Estadísticas recibidas: "+stats.length);
            //inicializamos los arrays para mostrar los datos
            stats.forEach(stat => {
                country.push(stat.country+"-"+stat.year);
                year.push(stat.year);
                ages_seventy.push(stat.ages_seventy);
                ages_fifty_seventy.push(stat.ages_fifty_seventy);
                ages_zero_fifty.push(stat.ages_zero_fifty);            
            });
        }else{
            console.log("Error cargando los datos");
		}
    }

async function getData(){
    const res= await fetch("/api/v1/air-pollution-stats");
    if(res.ok){
        const json = await res.json();
        apiData = json;
        loadGraph();

    }else{
        console.log("Error in request");
    }
}

async function loadGraph(){


Highcharts.chart('container', {
    chart: {
        type: 'spline',
        inverted: true
    },
    title: {
        text: 'Muertes por contaminacion de aire en interiores'
    },
    
    xAxis: {
        title: {
                    text: "País-Año",
                },
                categories: country,
            
    },
    yAxis: {
        title: {
            text: 'Muertes'
        },
       
    },
    legend: {
        enabled: false
    },
    tooltip: {
        headerFormat: '<b>{series.name}</b><br/>',
        pointFormat: '{point.y}muertes'
    },
    plotOptions: {
        spline: {
            marker: {
                enable: false
            }
        }
    },
    series: [
        {
        name: 'Mayores de 70 años',
        data: ages_seventy
    },
    {   name: 'Entre 50 y 70 años',
        data: ages_fifty_seventy},
    {   name:'Menores de 50 años',
        data: ages_zero_fifty}
    ]
});
}
onMount(getPEStats);
</script>
<svelte:head>


    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>


</svelte:head>

<main>
    <Navbar style="background-color: #6EAA8D; color:white;" light expand="lg" >
		<NavbarBrand href="#/info">INICIO</NavbarBrand>
		<Nav navbar>
			<Dropdown >
				<DropdownToggle nav caret> API </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./api/v2/economies">economies-Stats</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="./api/v1/esco-stats">esco-Stats</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="./api/v1/air-pollution-stats">Airpollution-Stats</DropdownItem>
				</DropdownMenu>
            </Dropdown>
              
            <Dropdown>
				<DropdownToggle nav caret> FRONT-END </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./#/economies">Economies FRONT-END</DropdownItem>
				  <DropdownItem href="./#/esco-stats">esco FRONT_END</DropdownItem>
				  <DropdownItem href="#/air-pollution-stats">AirPollution FRONT-END</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="#/graph">Conjunto</DropdownItem>
				</DropdownMenu>
			  </Dropdown>
			  
			  <Dropdown >
				<DropdownToggle nav caret> Gráficas </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./#/economies-graph">Economies-Stats</DropdownItem>
				  <DropdownItem href="./#/graphesco">esco-Stats</DropdownItem>
				  <DropdownItem href="#/graphAirPollution">AirPollution-Stats</DropdownItem>
                  <DropdownItem href="#/graph">Grafica comun</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="#/graph">Conjunto</DropdownItem>
				</DropdownMenu>
			  </Dropdown>
		  <!--<NavItem>
			<NavLink style="float:right; margin:left;" href="#/about">Acerca de</NavLink>
		  </NavItem>-->
		</Nav>
	</Navbar>
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            Los gráficos de spline son gráficos de líneas suavizadas y este ejemplo muestra un 
            gráfico de spline invertido. Invertir el gráfico significa que el eje X se coloca como 
            el eje vertical y el eje Y se coloca como el eje horizontal. Esto puede ser más intuitivo 
            para ciertos conjuntos de datos, como en este gráfico donde el eje X representa la altitud 
            vertical.
        </p>
    </figure>
    
</main>