<script>

import { onMount } from 'svelte';
import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Button} from 'sveltestrap';

let apiData = {};

const delay = ms => new Promise(res => setTimeout(res,ms));
    let stats = [];
    let country= [];
    let year = [];
    let expo_bys = [];
    let expo_m = [];
    let expo_tec = []; 
    async function getPEStats(){
        console.log("Fetching stats....");
        const res = await fetch("/api/v1/expo");
        if(res.ok){
            const data = await res.json();
            stats = data;
            console.log("Estadísticas recibidas: "+stats.length);
            //inicializamos los arrays para mostrar los datos
            stats.forEach(stat => {
                country.push(stat.country+"-"+stat.year);
                year.push(stat.year);
                expo_tec.push(stat.expo_bys);
                expo_m.push(stat.expo_m);
                expo_tec.push(stat.expo_tec);            
            });
        }else{
            console.log("Error cargando los datos");
		}
    }

async function getData(){
    const res= await fetch("/api/v1/expo");
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
        text: 'Exportaciones anuales'
    },
    
    xAxis: {
        title: {
                    text: "País-Año",
                },
                categories: country,
            
    },
    yAxis: {
        title: {
            text: 'Exportaciones'
        },
       
    },
    legend: {
        enabled: false
    },
    tooltip: {
        headerFormat: '<b>{series.name}</b><br/>',
        pointFormat: '{point.y}exportaciones'
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
        name: 'Exportaciones Bienes y Servicios',
        data: expo_bys
    },
    {   name: 'Exportaciones Prod. Manufacturados',
        data: expo_m},
    {   name:'Exportaciones Tecnológicas',
        data: expo_tec}
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
				  <DropdownItem href="./api/v1/expo">Expo-Stats</DropdownItem>
				</DropdownMenu>
            </Dropdown>
              
            <Dropdown>
				<DropdownToggle nav caret> FRONT-END </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./#/economies">Economies FRONT-END</DropdownItem>
				  <DropdownItem href="./#/esco-stats">esco FRONT_END</DropdownItem>
				  <DropdownItem href="#/expo">Expo FRONT-END</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="#/graph">Conjunto</DropdownItem>
				</DropdownMenu>
			  </Dropdown>
			  
			  <Dropdown >
				<DropdownToggle nav caret> Gráficas </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./#/economies-graph">Economies-Stats</DropdownItem>
				  <DropdownItem href="./#/graphesco">esco-Stats</DropdownItem>
				  <DropdownItem href="#/graphexpo">Expo-Stats</DropdownItem>
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