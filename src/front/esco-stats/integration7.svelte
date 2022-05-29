<script>

    import { onMount } from 'svelte';
    import * as c3 from "c3";
    import Alert from 'sveltestrap/src/Alert.svelte';
    import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Table,Button} from 'sveltestrap';
    import {pop} from 'svelte-spa-router';
    let apiData = {};
    const delay = ms => new Promise(res => setTimeout(res,ms));
        let checkMSG = "";
        let visible = false;
        let color = "danger";
        let stats = [];
        let stats1=[];
        let country= [];
        let year = [];
        let tot_wom = ["tot_wom"];
        let tot_man = ["tot_man"];
        let tot_esco = ["tot_esco"]; 
        let ages_seventy =["ages_seventy"];
        let ages_fifty_seventy =["ages_fifty_seventy"];
        let ages_zero_fifty =["ages_zero_fifty"];
        async function getData(){
            console.log("Fetching stats....");
            const res = await fetch("/api/v1/esco-stats");
            const res1= await fetch("https://reqres.in/api/unknown/2")
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
                console.log(stats1.data);
                console.log("Estadísticas recibidas: "+stats1.length);
                //inicializamos los arrays para mostrar los datos
                
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
           
           
        ],
        type: 'spline'
    },
    axis:{
        x:{
            type:'category',
            categories:country
    
        }
        }
});
    }
    async function Loadinfo(){
        console.log("Loading info....");
        const res = await fetch("https://reqres.in/api/unknown/2"
			).then(function (res){
				color="success";
				checkMSG="Nombre: "+JSON.stringify(stats1.data.name)+"        año de creación: "+JSON.stringify(stats1.data.year);
				visible="true";
				
				//window.alert("Entradas cargadas con éxito");
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

        <Button outline color="success" on:click={Loadinfo}>
            Información de los datos
        </Button>   
        
        <Button on:click="{pop}">
            Volver
        </Button>
        <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
            {#if checkMSG}
                {checkMSG}
            {/if}
        </Alert>
        
        
    </main>