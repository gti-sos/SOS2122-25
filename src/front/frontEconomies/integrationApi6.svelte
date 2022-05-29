<script>
    import { onMount } from 'svelte';
    import "billboard.js/dist/theme/insight.css";
    import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Button} from 'sveltestrap';
    import {Table} from 'sveltestrap';
    import {pop} from 'svelte-spa-router';
    let apiData = {};
    const delay = ms => new Promise(res => setTimeout(res,ms));
        let stats = [];
        let country= [];
        let year = [];
        let average = ["average"];
        let women = ["women"];
        let men = ["men"]; 
        let economies = [];
        let percapita = ["percapita"];
        let currency = ["currency"];
        let currentprices = ["currentprices"];
        async function loadGraph(){
            console.log("Fetching stats....");
            const res1 = await fetch("https://sos2122-32.herokuapp.com/api/v1/housework-stats/");
            const res2 = await fetch("/api/v2/economies");
            if(res1.ok && res2.ok){
                const data = await res1.json();
                const data2 = await res2.json();
                stats = data;
                if (stats.length == 0) {
                    const res = await fetch("https://sos2122-32.herokuapp.com/api/v1/housework-stats/loadInitialData");
                }
                console.log("Estadísticas recibidas: "+stats.length);
                //inicializamos los arrays para mostrar los datos
                stats.forEach(stat => {
                    country.push(stat.country+"-"+stat.year);
                    year.push(stat.year);
                    average.push(stat.average);
                    women.push(stat.women);
                    men.push(stat.men);           
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
                    columns: [
                        average,men,women,percapita,currency,currentprices
                    ],
                
                    types: {
                        average: "spline", // for ESM specify as: area()
                        men: "spline",
                        women: "spline", // for ESM specify as: areaSpline()
                        percapita: "spline",
                        currency:"spline",
                        currentprices: "spline"
                    }
                },
                axis: {
                    x: {
                    type: "category",
                    categories: country
                    }
                },
                bindto: "#areaRangeChart"
            });
                    
            setTimeout(function() {
                chart.load({
                       columns: [
                        average,women,men,percapita,currency,currentprices
                       ]
                    });
            }, 500);
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

        <p>Comparacion del trabajo en casa</p>
    
        <div id="splineChart"></div>
           
    </main>