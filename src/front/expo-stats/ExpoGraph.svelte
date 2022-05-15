<script>
    import { onMount } from "svelte";
    import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Button} from 'sveltestrap';

    const delay=ms=>new Promise(res=>setTimeout(res,ms));

    let expos=[];
    let country=[];
    let year=[];
    let expo_tec=[];
    let expo_m=[];
    let tot_esco=[];
    let datosOrdenados=[];

    async function getData(){
        console.log("Fetching expo....");
        const res = await fetch("/api/v1/expo");
        if(res.ok){
            const data = await res.json();          
            expos = data;
            if (expos.length == 0) {
                const res = await fetch("/api/v1/expo-stats/loadInitialData");
                console.log("Entradas recibidas: "+expos.length);
            //con la siguiente funcion ordeno los datos por años de menor a mayor
            datosOrdenados = expos.sort(function (a, b){
            return (a.year - b.year)
            });
            console.log("Ordenadas correctamente");
            datosOrdenados.forEach(expo => {
                year.push(expo.year);
                country.push(expo.country+"-"+ expo.year);
                expo_tec.push(expo.expo_tec);
                expo_m.push(expo.expo_m);
                tot_esco.push(expo.tot_esco);          
            });
            location.reload();
            }
            else{
               console.log("Entradas recibidas: "+expos.length);
            //con la siguiente funcion ordeno los datos por años de menor a mayor
            datosOrdenados = expos.sort(function (a, b){
            return (a.year - b.year)
            });
            console.log("Ordenadas correctamente");
            datosOrdenados.forEach(expo => {
                year.push(expo.year);
                country.push(expo.country+"-"+expo.year);
                expo_tec.push(expo.expo_tec);
                expo_m.push(expo.expo_m);
                tot_esco.push(expo.tot_esco);            
            }); 
            }
            
        }else{
            console.log("Error, can`t charge data");
        }
    }
    

    async function loadGraph() {
        Highcharts.chart("container", {
            chart: {
                type: "column",
            },
            title: {
                text: "País",
            },
            subtitle: {
                text: "Source: https://ourworldindata.org/expo",
            },
            xAxis: {
                categories: country,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: "%(Según el PIB)",
                },
            },
            tooltip: {
                headerFormat:
                    '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                    '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y} % de exportaciones</b></td></tr>',
                footerFormat: "</table>",
                shared: true,
                useHTML: true,
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                },
            },
            series: [
                {
                name: 'Exportaciones Bienes y Servicios',
                data: tot_esco
                },
                {
                name: 'Exportaciones Prod. Manufacturados',
                data: expo_m
                },
                {
                name: 'Exportaciones Tecnológicas',
                data: expo_tec
                
                }
                
            ]
        });
    }
    onMount(getData);
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/exporting.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/export-data.js" on:load="{loadGraph}"></script>
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
				  <DropdownItem href="./api/v1/expo">expo-Stats</DropdownItem>
				</DropdownMenu>
            </Dropdown>
              
            <Dropdown>
				<DropdownToggle nav caret> FRONT-END </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./#/economies">economies FRONT-END</DropdownItem>
                  <DropdownItem divider/>
				  <DropdownItem href="./#/esco-stats">esco FRONT_END</DropdownItem>
                  <DropdownItem divider/>
				  <DropdownItem href="#/expo">expo FRONT-END</DropdownItem>
				</DropdownMenu>
			  </Dropdown>
			  
			  <Dropdown >
				<DropdownToggle nav caret> Gráficas </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./#/economies-graph">economies-Stats</DropdownItem>
                  <DropdownItem divider/>
				  <DropdownItem href="./#/graphesco">esco-Stats</DropdownItem>
                  <DropdownItem divider/>
				  <DropdownItem href="#/graphexpo">expo-Stats</DropdownItem>
                  <DropdownItem divider/>
                  <DropdownItem href="./#/graph">Grafica comun</DropdownItem>
				</DropdownMenu>
			  </Dropdown>
		  <!--<NavItem>
			<NavLink style="float:right; margin:left;" href="#/about">Acerca de</NavLink>
		  </NavItem>-->
		</Nav>
	</Navbar>
    <figure class="highcharts-figure">
        <div id="container" />
        <p class="highcharts-description">
            Este gráfico compara las exportaciones de diferentes paises
    </figure>
</main>
