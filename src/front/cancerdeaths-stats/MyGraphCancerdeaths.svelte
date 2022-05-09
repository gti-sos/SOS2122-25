<script>

    import { onMount } from 'svelte';
    import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Button} from 'sveltestrap';
    const delay = ms => new Promise(res => setTimeout(res, ms));

    let year = [];
    let country = [];
    let ages_zero_fifty = [];
    let ages_fifty_seventy = [];
    let ages_seventy = [];
    let datos = []; 
    let datosOrdenados = [];   
    //creo 2 let datos para poder ordenado los datos por año

    async function getData(){
        console.log("Fetching cancerdeaths....");
        const res = await fetch("/api/v1/cancerdeaths-stats");
        if(res.ok){
            const data = await res.json();          
            datos = data;
            //si no tenemos ningun dato cargado, cargamos los datos iniciales, si tiene datos los obtiene sin cargar los iniciales
            if (datos.length == 0) {
                const res = await fetch("/api/v1/cancerdeaths-stats/loadInitialData");
                console.log("Entradas recibidas: "+datos.length);
            //con la siguiente funcion ordeno los datos por años de menor a mayor
            datosOrdenados = datos.sort(function (a, b){
            return (a.year - b.year)
            });
            console.log("Ordenadas correctamente");
            datosOrdenados.forEach(dato => {
                year.push(dato.year);
                country.push(dato.country+"-"+dato.year);
                ages_zero_fifty.push(dato.ages_zero_fifty);
                ages_fifty_seventy.push(dato.ages_fifty_seventy);
                ages_seventy.push(dato.ages_seventy);          
            });
            location.reload();
            }
            else{
               console.log("Entradas recibidas: "+datos.length);
            //con la siguiente funcion ordeno los datos por años de menor a mayor
            datosOrdenados = datos.sort(function (a, b){
            return (a.year - b.year)
            });
            console.log("Ordenadas correctamente");
            datosOrdenados.forEach(dato => {
                year.push(dato.year);
                country.push(dato.country+"-"+dato.year);
                ages_zero_fifty.push(dato.ages_zero_fifty);
                ages_fifty_seventy.push(dato.ages_fifty_seventy);
                ages_seventy.push(dato.ages_seventy);            
            }); 
            }
            
        }else{
            console.log("Error, can`t charge data");
		}
    }

    async function loadGraph(){
        Highcharts.chart('container', {
            chart: {
                type: 'area'
            },
            title: {
                text: 'Grafica de muertes producidad por cancer'
            },
            subtitle: {
                text: 'Source: https://ourworldindata.org/cancer#deaths-from-cancer'
            },
            xAxis: {
                categories: country,
                tickmarkPlacement: 'on',
                title: {
                    enabled: false
                }
            },
            yAxis: {
                
                title: {
                    text: 'Muertes'
                },
                
            },
            tooltip: {
                split: true,
                valueSuffix: 'muertes'
            },
            plotOptions: {
                
                area: {
                    stacking: 'normal',
                    lineColor: '#666666',
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        lineColor: '#666666'
                    }
                }
            },
            
            series: [
                {
                name: 'Mayores de 70 años',
                data: ages_seventy
                },
                {
                name: 'Entre 50 y 70 años',
                data: ages_fifty_seventy
                },
                {
                name: 'Menores de 50 años',
                data: ages_zero_fifty
                }
            ]
        });
    }   

    onMount(getData);
    
</script>

<svelte:head>

    <script src="https://code.highcharts.com/highcharts.js"on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"on:load="{loadGraph}"></script>


</svelte:head>

<main>
    <!--barra de navegacion-->
	<Navbar style="background-color: #6EAA8D; color:white;" light expand="lg" >
		<NavbarBrand href="#/info">INICIO</NavbarBrand>
		<Nav navbar>
			<Dropdown >
				<DropdownToggle nav caret> API </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./api/v1/cancerdeaths-stats">Cancerdeaths-Stats</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="./api/v1/esco-stats">esco-Stats</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="./api/v1/air-pollution-stats">Airpollution-Stats</DropdownItem>
				</DropdownMenu>
            </Dropdown>
              
            <Dropdown>
				<DropdownToggle nav caret> FRONT-END </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./#/Cancerdeaths-stats">Cancerdeaths FRONT-END</DropdownItem>
				  <DropdownItem href="#/graphics/line/province-budget-and-investment-in-social-promotion">Inversion promoción social</DropdownItem>
				  <DropdownItem href="#/graphics/azar-games-and-bet-activities">Actividad en loteria</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="#/analytics">Conjunto</DropdownItem>
				</DropdownMenu>
			  </Dropdown>
			  
			  <Dropdown >
				<DropdownToggle nav caret> Gráficas </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./#/cancerdeaths-graph">Cancerdeaths-Stats</DropdownItem>
				  <DropdownItem href="#/graphics/line/province-budget-and-investment-in-social-promotion">Inversion promoción social</DropdownItem>
				  <DropdownItem href="#/graphics/azar-games-and-bet-activities">Actividad en loteria</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="#/analytics">Conjunto</DropdownItem>
				</DropdownMenu>
			  </Dropdown>
		  <!--<NavItem>
			<NavLink style="float:right; margin:left;" href="#/about">Acerca de</NavLink>
		  </NavItem>-->
		</Nav>
	</Navbar>
	<!---->
    <br>
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            <!--A demo showing a stacked area chart, also sometimes referred to as a
            mountain chart. In a stacked chart, the data series values are added
            together to make up a total.-->
        </p>
    </figure>

</main>