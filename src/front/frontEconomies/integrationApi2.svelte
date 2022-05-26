<script>
    import { onMount } from 'svelte';
    import "billboard.js/dist/theme/insight.css";
    import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Button} from 'sveltestrap';
    import {Table} from 'sveltestrap';
    import {pop} from 'svelte-spa-router';
import Economies from './economies.svelte';
    let apiData = {};
    const delay = ms => new Promise(res => setTimeout(res,ms));
        let stats = [];
        let economies = [];
        let country= [];
        let year = [];
        let percapita = ["percapita"];
        let currency = ["currency"];
        let currentprices = ["currentprices"];
        let coefficients = ["coefficients"];
        let lifes = ["lifes"];
        let educations = ["educations"]; 
        async function loadGraph(){
            console.log("Fetching stats....");
            const res1 = await fetch("/economies/remoteAPI2");
            const res2 = await fetch("/api/v2/economies");
            if(res1.ok && res2.ok){
                const data1 = await res1.json();
                const data2 = await res2.json();
                stats = data1;
                console.log("Estadísticas recibidas: "+stats.length);
                //inicializamos los arrays para mostrar los datos
                stats.forEach(stat => {
                    country.push(stat.country+"-"+stat.year);
                    year.push(stat.year);
                    coefficients.push(stat.coefficients);
                    lifes.push(stat.lifes);
                    educations.push(stat.educations);           
                });

                economies=data2;
                if (economies.length == 0) {
                    const res = await fetch("/api/v2/economies/loadInitialData");
                }
                console.log("Recibido: " + economies.length);
                economies.forEach(economy=>{
                    percapita.push(economy.percapita);
                    currency.push(economy.currency);
                    currentprices.push(economy.currentprices);
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
                            type: country
                         }
                      },
                     columns: [
    
                      ],
   
                   types: {
                        coefficients: "area", // for ESM specify as: area()
                        educations: "area-spline",
                        lifes: "area-spline",
                        percapita: "area-spline",
                        currency:"area-spline",
                        currentprices: "area-spline"
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
                        educations
                    ]
                });
            }, 1000);
            setTimeout(function() {
                chart.load({
                    columns: [
                        lifes
                    ]
                });
            }, 1500);
            console.log(coefficients)
            setTimeout(function() {
                chart.load({
                    columns: [
                        percapita
                    ]
                });
            }, 1500);
            setTimeout(function() {
                chart.load({
                    columns: [
                        currency
                    ]
                });
            }, 1500);
            setTimeout(function() {
                chart.load({
                    columns: [
                        currentprices
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


            <div id="chart"></div>
           
    </main>