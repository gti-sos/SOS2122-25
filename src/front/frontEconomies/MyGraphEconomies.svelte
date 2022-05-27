<script>

    import { onMount } from 'svelte';
    import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Button} from 'sveltestrap';
    const delay = ms => new Promise(res => setTimeout(res, ms));

    let year = [];
    let country = [];
    let percapita = [];
    let currency = [];
    let currentprices = [];
    let datos = []; 
    let datosOrdenados = [];   
    //creo 2 let datos para poder ordenado los datos por año

    async function getData(){
        console.log("Fetching Economies....");
        const res = await fetch("/api/v2/economies");
        if(res.ok){
            const data = await res.json();          
            datos = data;
            
            if (datos.length == 0) {
                const res = await fetch("/api/v2/economies/loadInitialData");
                console.log("Entradas recibidas: "+datos.length);
                datosOrdenados = datos.sort(function (a, b){
                return (a.year - b.year)
            });
            console.log("Ordenadas correctamente");
            datosOrdenados.forEach(dato => {
                year.push(dato.year);
                country.push(dato.country+"-"+dato.year);
                percapita.push(dato.percapita);
                currency.push(dato.currency);
                currentprices.push(dato.currentprices);          
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
                percapita.push(dato.percapita);
                currency.push(dato.currency);
                currentprices.push(dato.currentprices);            
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
                text: 'Economia Mundial'
            },
            xAxis: {
                categories: country
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'percapita',
                data: percapita
                },
                {
                name: 'currency',
                data: currency
                },
                {
                name: 'currentprices',
                data: currentprices
                }
            ]
        });
    }   

    onMount(getData);
    
</script>

<svelte:head>

    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"on:load="{loadGraph}"></script>


</svelte:head>

<main>
    <!--barra de navegacion-->
	<Navbar style="background-color: lightgreen; color:white;" light expand="lg" >
		<NavbarBrand href="#/info">INICIO</NavbarBrand>
		<Nav navbar>
			<Dropdown >
				<DropdownToggle nav caret> API </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./api/v2/economies">economies-Stats</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="./api/v1/esco-stats">esco-Stats</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="./api/v1/expo-stats">expo-Stats</DropdownItem>
				</DropdownMenu>
            </Dropdown>
              
            <Dropdown>
				<DropdownToggle nav caret> FRONT-END </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./#/economies">economies FRONT-END</DropdownItem>
				  <DropdownItem href="#/esco-stats">esco-Stats FRONT-END</DropdownItem>
				  <DropdownItem href="#/expo">expo-Stats FRONT-END</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="#/graph">Conjunto</DropdownItem>
				</DropdownMenu>
			  </Dropdown>
			  
			  <Dropdown >
				<DropdownToggle nav caret> Gráficas </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./#/economies-graph">economies-Stats</DropdownItem>
				  <DropdownItem href="#/graphesco">esco-Stats</DropdownItem>
				  <DropdownItem href="#/graphexpo">Expo-Stats</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="#/graph">Conjunto</DropdownItem>
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
            A simple demo showcasing an area chart with negative values and multiple
            data series. Note that interacting with one data series will dim the
            others, making it easier to distinguish between them.
        </p>
    </figure>

</main>