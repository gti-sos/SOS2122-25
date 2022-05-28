<script>
    import { onMount } from 'svelte';
    import "billboard.js/dist/theme/insight.css";
    import Alert from 'sveltestrap/src/Alert.svelte';
    import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Table,Button} from 'sveltestrap';
    import {pop} from 'svelte-spa-router';
    let checkMSG = "";
    let visible = false;
    let color = "danger";

    let economies = [];
    let percapita = ["percapita"];
    let currency = ["currency"];
    let currentprices = ["currentprices"];

    const delay = ms => new Promise(res => setTimeout(res,ms));

    
    async function loadGraph(){
            console.log("Fetching stats....");
            const res = await fetch("/api/v2/economies");
            if(res.ok){
                const data = await res.json();


                economies=data;
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
                    type: "category"
                    }
                },
                    columns: [
                    
                    ],
                
                    types: {
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
                        percapita,currency,currentprices
                       ]
                    });
            }, 500);
    }
    async function loadData(){
        let url = 'https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits';
        let response = await fetch(url);

        let commits = await response.json(); // leer respuesta del cuerpo y devolver como JSON
        console.log("Estadísticas recibidas: "+commits.length);

			checkMSG= "Nombre: "+JSON.stringify(commits[1].author.login)+"\n"+"Id: "+JSON.stringify(commits[1].author.id)+"\n"+"email: "+JSON.stringify(commits[1].author.html_url)+"\n";
            checkMSG= checkMSG+"   y \n Nombre: "+JSON.stringify(commits[2].author.login)+"\n"+"Id: "+JSON.stringify(commits[2].author.id)+"\n"+"email: "+JSON.stringify(commits[2].author.html_url)+"\n";

			visible="true";
        
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
        <Button outline color="success" on:click={loadData}>
            Datos creadores
        </Button> 
        <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
            {#if checkMSG}
                {checkMSG}
            {/if}
        </Alert>
           
    </main>