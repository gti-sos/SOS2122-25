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
        let code = ["code"];
        let built_area = ["built_area"];
        let grazing_area = ["grazing_area"]; 
        async function loadGraph(){
            console.log("Fetching stats....");
            const res = await fetch("/economies/remoteAPI3");
            if(res.ok){
                const data = await res.json();
                stats = data;
                if (stats.length == 0) {
                    const res = await fetch("/economies/remoteAPI3/loadInitialData");
                }
                console.log("Estadísticas recibidas: "+stats.length);
                //inicializamos los arrays para mostrar los datos
                stats.forEach(stat => {
                    country.push(stat.country+"-"+stat.year);
                    year.push(stat.year);
                    code.push(stat.code);
                    built_area.push(stat.built_area);
                    grazing_area.push(stat.grazing_area);           
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
                    code: "area", // for ESM specify as: area()
                    grazing_area: "area-spline",
                    built_area: "area-spline" // for ESM specify as: areaSpline()
                    }
                },
                bindto: "#areaChart"
            });
                    
            setTimeout(function() {
                chart.load({
                       columns: [
                        code
                       ]
                    });
            }, 500);
            setTimeout(function() {
                chart.load({
                        columns: [
                            grazing_area
                        ]
                });
            }, 1000);
            setTimeout(function() {
                chart.load({
                    columns: [
                        built_area
                    ]
                });
            }, 1500);
            console.log(code)
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