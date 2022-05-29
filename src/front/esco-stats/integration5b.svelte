<script>

    import { onMount } from 'svelte';
    import * as c3 from "c3";
    import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Table,Button} from 'sveltestrap';
    import {pop} from 'svelte-spa-router';
    let apiData = {};
    const delay = ms => new Promise(res => setTimeout(res,ms));
        let stats = [];
        let stats1=[];
        let country= [];
        let year = [];
        let tot_wom = ["tot_wom"];
        let tot_man = ["tot_man"];
        let tot_esco = ["tot_esco"]; 
        let total_debt =["total_debt"];
        let debt_gdp =["debt_gdp"];
        let per_capita_debt =["per_capita_debt"];
        async function getData(){
            console.log("Fetching stats....");
            const res = await fetch("/api/v1/esco-stats");
            const res1= await fetch("/remoteAPI5b-esco")
            if(res.ok&&res1.ok){
                const data = await res.json();
                const data1= await res1.json();
                stats = data;
                console.log("Estadísticas recibidas: "+stats.length);
                //inicializamos los arrays para mostrar los datos
                stats.forEach(stat => {
                    country.push(stat.country+"-"+stat.year);
                    
                    tot_wom.push(stat.tot_wom);
                    tot_man.push(stat.tot_man);
                    tot_esco.push(stat.tot_esco);
                              
                });
                stats1 = data1;
                console.log("Estadísticas recibidas: "+stats1.length);
                //inicializamos los arrays para mostrar los datos
                stats1.forEach(stat => {
                    country.push(stat.country+"-"+stat.year);
              
                    total_debt.push(stat.total_debt);
                    debt_gdp.push(stat.debt_gdp);
                    per_capita_debt.push(stat.per_capita_debt); 
                });
            }else{
                console.log("Error cargando los datos");
            }
            loadGraph();
            console.log("Comprobando");
        }
             

    async function loadGraph(){
    
    
            var chart= c3.generate({
                bindto: '#chart',
    data: {
        
        columns: [
           tot_wom,
           tot_man,
           tot_esco,
           total_debt,
           debt_gdp,
           per_capita_debt,
           
        ],
        type: 'pie'
    },
    axis:{
        x:{
            type:'category',
            categories:country
    
        }
        }
});
    }
           

       
    onMount(getData);
    </script>
    <svelte:head>
    
        <!-- Load c3.css -->
        <link rel="stylesheet" href="./c3/c3.css"  >

        
    
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
           
          
        <Button on:click="{pop}">
            Volver
        </Button>
    </main>
