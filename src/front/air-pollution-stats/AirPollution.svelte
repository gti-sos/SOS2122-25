<script>
    import {onMount} from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte'; 
	import Alert from 'sveltestrap/src/Alert.svelte';
	import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'sveltestrap';

	let airpollution=[];
	let from=null;
	let to=null;
	let offset=0;
	let limit=10;

	let numEntries;
	let checkMSG = "";
    let visible = false;
    let color = "danger";

    let newAirpollution={
        country: "",
        year:"",
        ages_zero_fifty:"",
        ages_fifty_seventy:"",
        ages_seventy:""
    }

	onMount(getAirpollution);

	async function getAirpollution(){
		console.log("fetching airpollution ....");
		let cadena=`/api/v1/air-pollution-stats?offset=+${offset}+&limit=+${limit}`;
		if(from !=null){
			cadena=cadena + `&from=${from}&` 
		}
		if(to !=null){
			cadena=cadena + `to=${to}`
		}

		const res= await fetch(cadena);
		if(res.ok){
			const data= await res.json();
			airpollution=data;
			numEntries=airpollution.length;
			console.log("Received airpollution: " + airpollution.length);
		}else{
			color="danger";
			checkMSG="No hay entradas para esas fechas";
			visible="true";
		}
	}
	async function getPgAnt() {
		if(offset>=10){

			offset=offset-10;
		}
		//limit=limit+10;
        console.log("fetching airpollution ....");
		let cadena = `/api/v1/air-pollution-stats?offset=+${offset}+&limit=+${limit}`;
		if(from !=null){
            cadena=cadena + `&from=${from}&` 
        }
        if(to !=null){
            cadena=cadena + `to=${to}`
        }
		const res= await fetch(cadena);
		if(res.ok){
			const data= await res.json();
			airpollution=data;
			console.log("Received airpollution: " + airpollution.length);
		}
    }
	async function getPgSig() {
		if(airpollution.length>=10){

			offset=offset+10;
		}
		//limit=limit+10;
        console.log("fetching airpollution ....");
		let cadena = `/api/v1/air-pollution-stats?offset=+${offset}+&limit=+${limit}`;
		if(from !=null){
            cadena=cadena + `&from=${from}&` 
        }
        if(to !=null){
            cadena=cadena + `to=${to}`
        }
		const res= await fetch(cadena);
		if(res.ok){
			const data= await res.json();
			airpollution=data;
			console.log("Received airpollution: " + airpollution.length);
		}
    }
	
	async function insertAirpollution(){
		if (newAirpollution.country == "" || newAirpollution.country == null || newAirpollution.year == "" || newAirpollution.year == null) {
			color="danger";
			checkMSG="Debes insertar el nombre del país y el año.";
			visible="true";
         }else{
        console.log("Inserting Airpollution...."+JSON.stringify(newAirpollution));
        const res = await fetch("/api/v1/air-pollution-stats",
			{
				method: "POST",
				body: JSON.stringify(newAirpollution),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res){
				if(res.status == 201){
					color="success";
					checkMSG="Entrada introducida con éxito";
					visible="true";
				getAirpollution();
				
				}
				else if(res.status == 409){
					color="danger";
					checkMSG="Ya existe ese recurso en la base de datos";
					visible="true";
                     console.log("ERROR There is already a data with that country and year in the database");
                     
                 }
			});  
    }}
	async function BorrarAirpollution(name, year) {
        const res = await fetch("/api/v1/air-pollution-stats/"+name+"/"+year, {
            method: "DELETE"
        }).then(function(res) {
           
            getAirpollution();      
            if (res.status==200) {
                color="success";
				checkMSG=name + " entrada borrada correctamente";
				visible="true";
				console.log("Deleted " + name);            
            }else  {
                color="danger";
				checkMSG=name + "no se ha podido borrar la entrada";
				visible="true";
                console.log("DATA NOT FOUND");            
            
            }      
        });
    }
	async function BorrarAirpollutionAll(){
        console.log("Deleting airpollution....");
        const res = await fetch("/api/v1/air-pollution-stats/",
			{
				method: "DELETE"
			}).then(function (res){
				
				color="success";
				checkMSG="Entradas elimidas con éxito";
				visible="true";
				getAirpollution();
			});
    }

	async function LoadAirpollution(){
        console.log("Loading airpollution....");
        const res = await fetch("/api/v1/air-pollution-stats/loadInitialData",
			{
				method: "GET"
			}).then(function (res){
				getAirpollution();
				color="success";
				checkMSG="Entradas cargadas con éxito";
				visible="true";
			});
    }
</script>

<main>
	<Navbar style="background-color: #6EAA8D; color:white;" light expand="lg" >
		<NavbarBrand href="#/info">INICIO</NavbarBrand>
		<Nav navbar>
			<Dropdown >
				<DropdownToggle nav caret> API </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./api/v2/economies">Economies-Stats</DropdownItem>
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
				  <DropdownItem href="./#/esco-stats">esco FRONT_END</DropdownItem>
				  <DropdownItem href="#/air-pollution-stats">AirPollution FRONT-END</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="#/analytics">Conjunto</DropdownItem>
				</DropdownMenu>
			  </Dropdown>
			  
			  <Dropdown >
				<DropdownToggle nav caret> Gráficas </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./#/economies-graph">Cancerdeaths-Stats</DropdownItem>
				  <DropdownItem href="./#/graphesco">esco-Stats</DropdownItem>
				  <DropdownItem href="#/graphAirPollution">AirPollution-Stats</DropdownItem>
                  <DropdownItem href="#/graph">Grafica comun</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="#/analytics">Conjunto</DropdownItem>
				</DropdownMenu>
			  </Dropdown>
		  <!--<NavItem>
			<NavLink style="float:right; margin:left;" href="#/about">Acerca de</NavLink>
		  </NavItem>-->
		</Nav>
	</Navbar>
    <h1>Economia Mundial</h1>
	<Button on:click="{getPgAnt}">
		Página Anterior
	</Button>
	<Button on:click="{getPgSig}">
		Página Siguiente
	</Button>
    {#await airpollution}
loading
	{:then airpollution}
	<Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
		{#if checkMSG}
			{checkMSG}
		{/if}
	</Alert>

	<Table bordered>
		<thead>
			<tr>
				<th>Fecha de inicio</th>
				<th>Fecha fin</th>
			</tr>
		</thead>
		<tbody>

		
		<tr>
			<td><input type="number" min="0" bind:value="{from}"></td>
			<td><input type="number" min="0" bind:value="{to}"></td>
			<td align="center"><Button outline color="dark" on:click="{()=>{
				if (from == null || to == null) {
					color="success";
					checkMSG="Los campos fecha inicio y fecha fin no pueden estar vacíos";
					visible="true";
				}else{
					getAirpollution();
				}
			}}">
				Buscar
				</Button>
			</td>
			<td align="center"><Button outline color="info" on:click="{()=>{
				from = null;
				to = null;
				getAirpollution();
				
			}}">
				Limpiar Búsqueda
				</Button>
			</td>
		</tr>
		</tbody>
	</Table>


	<Table bordered>
		<thead>
			<tr>
				<th>País</th>
				<th>Año</th>
                <th>Per Capita</th>
                <th>currency</th>
                <th>currentprices</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input bind:value="{newAirpollution.country}"></td>
				<td><input type="number" bind:value="{newAirpollution.year}"></td>
				<td><input bind:value="{newAirpollution.ages_zero_fifty}"></td>
				<td><input bind:value="{newAirpollution.ages_fifty_seventy}"></td>
				<td><input bind:value="{newAirpollution.ages_seventy}"></td>

				<td><Button outline color="primary" on:click="{insertAirpollution}">
					Añadir
					</Button>
				</td>
				<td align="center"><Button outline color="primary" on:click="{()=>{
					newAirpollution.country = null;
					newAirpollution.year = null;
					newAirpollution.ages_zero_fifty = null;
					newAirpollution.ages_fifty_seventy = null;
					newAirpollution.ages_seventy = null;
				}}">
					Limpiar
					</Button>
				</td>
			</tr>
			{#each airpollution as airpollutionn}
			<tr>
				<td>{airpollutionn.country}</td>
				<td>{airpollutionn.year}</td>
                <td>{airpollutionn.ages_zero_fifty}</td>
                <td>{airpollutionn.ages_fifty_seventy}</td>
                <td>{airpollutionn.ages_seventy}</td>

				<td><Button outline color="warning" on:click={function (){
					window.location.href = `/#/air-pollution/${airpollutionn.country}/${airpollutionn.year}`
				}}>
					Editar
				</Button>
				<td><Button outline color="danger" on:click={BorrarAirpollution(airpollutionn.country,airpollutionn.year)}>
					Borrar
				</Button>
				</td>
			</tr>
			{/each}
			<tr>
				<td><Button outline color="success" on:click={LoadAirpollution}>
					Cargar datos
				</Button></td>
				<td><Button outline color="danger" on:click={BorrarAirpollutionAll}>
					Borrar todo
				</Button></td>
			</tr>
			
		</tbody>
	</Table>

{/await}
</main>