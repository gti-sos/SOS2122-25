<script>
    import { onMount } from "svelte";
    import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Button} from 'sveltestrap';

    const delay=ms=>new Promise(res=>setTimeout(res,ms));

    let escos=[];
    let country=[];
    let year=[];
    let tot_wom=[];
    let tot_man=[];
    let tot_esco=[];
    let datosOrdenados=[];

    async function getData(){
        console.log("Fetching esco....");
        const res = await fetch("/api/v1/esco-stats");
        if(res.ok){
            const data = await res.json();          
            escos = data;
            if (escos.length == 0) {
                const res = await fetch("/api/v1/esco-stats/loadInitialData");
                console.log("Entradas recibidas: "+escos.length);
            //con la siguiente funcion ordeno los datos por años de menor a mayor
            datosOrdenados = escos.sort(function (a, b){
            return (a.year - b.year)
            });
            console.log("Ordenadas correctamente");
            datosOrdenados.forEach(esco => {
                year.push(esco.year);
                country.push(esco.country+"-"+ esco.year);
                tot_wom.push(esco.tot_wom);
                tot_man.push(esco.tot_man);
                tot_esco.push(esco.tot_esco);          
            });
            location.reload();
            }
            else{
               console.log("Entradas recibidas: "+escos.length);
            //con la siguiente funcion ordeno los datos por años de menor a mayor
            datosOrdenados = escos.sort(function (a, b){
            return (a.year - b.year)
            });
            console.log("Ordenadas correctamente");
            datosOrdenados.forEach(esco => {
                year.push(esco.year);
                country.push(esco.country+"-"+esco.year);
                tot_wom.push(esco.tot_wom);
                tot_man.push(esco.tot_man);
                tot_esco.push(esco.tot_esco);            
            }); 
            }
            
        }else{
            console.log("Error, can`t charge data");
        }
    }
    

    async function loadGraph() {
        var chart = c3.generate({
    data: {
      columns: [
        ['data1', 30, 200, 100, 400, 150, 250],
        ['data2', 50, 20, 10, 40, 15, 25]
      ],
      axes: {
        data2: 'y2'
      },
      types: {
          'data1': 'line',
          'data2': 'area'
      },
      colors: {
          data1: '#ff0000',
          data2: '#00ff00',
          data3: '#0000ff'
      },
      color: function (color, d) {
         // d will be 'id' when called for legends
         return d.id && d.id === 'data2' ? d3.rgb(color).darker(d.value / 150) : color;
      }
    },
    axis: {
      x: {
        label: {
          text: 'Etiqueta eje X',
          position: 'inner-left'
        }  
      },
      y: {
        label: {
          text: 'Etiqueta eje Y',
          position: 'outer-middle'
        }
      },
      y2: {
        show: true, // ADD
        label: {
          text: 'Etiqueta eje Y2',
          position: 'outer-bottom'
        },
      }
    }
  });
    }
    onMount(getData);
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
				  <DropdownItem href="./api/v1/expo-stats">expo-Stats</DropdownItem>
				</DropdownMenu>
            </Dropdown>
              
            <Dropdown>
				<DropdownToggle nav caret> FRONT-END </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./#/economies">economies FRONT-END</DropdownItem>
                  <DropdownItem divider/>
				  <DropdownItem href="./#/esco-stats">esco FRONT_END</DropdownItem>
                  <DropdownItem divider/>
				  <DropdownItem href="#/expo-stats">expo FRONT-END</DropdownItem>
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
            Este gráfico compara los valores de escolarizacion en distintas edades
    </figure>
</main>