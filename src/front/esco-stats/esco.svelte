<script>
    import {onMount} from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte'; 
	import Alert from 'sveltestrap/src/Alert.svelte';
	import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'sveltestrap';

	let esco=[];
	let from=null;
	let to=null;
	let offset=0;
	let limit=10;
	let checkMSG = "";
    let visible = false;
    let color = "danger";
	


	let numEntries;

    let newesco={
        country: "",
        year:"",
        tot_wom:"",
        tot_man:"",
        tot_esco:""
    }

	onMount(getesco);

	async function getesco(){
		console.log("fetching esco ....");
		let cadena=`/api/v1/esco-stats?offset=+${offset}+&limit=+${limit}`;
		if(from !=null){
			cadena=cadena + `&from=${from}&` 
		}
		if(to !=null){
			cadena=cadena + `to=${to}`
		}

		const res= await fetch(cadena);
		if(res.ok){
			const data= await res.json();
			esco=data;
			numEntries=esco.length;
			console.log("Received esco: " + esco.length);
		}else{
			color="danger";
			checkMSG="No hay entradas para esas fechas";
			visible="true";
			//window.alert("No hay entradas para esas fechas");
		}
	}
	async function getPgAnt() {
		if(offset>=10){

			offset=offset-10;
		}
		//limit=limit+10;
        console.log("fetching esco ....");
		let cadena = `/api/v1/esco-stats?offset=+${offset}+&limit=+${limit}`;
		if(from !=null){
            cadena=cadena + `&from=${from}&` 
        }
        if(to !=null){
            cadena=cadena + `to=${to}`
        }
		const res= await fetch(cadena);
		if(res.ok){
			const data= await res.json();
			esco=data;
			console.log("Received esco: " + esco.length);
		}
    }
	async function getPgSig() {
		if(esco.length>=10){

			offset=offset+10;
		}
		//limit=limit+10;
        console.log("fetching esco ....");
		let cadena = `/api/v1/esco-stats?offset=+${offset}+&limit=+${limit}`;
		if(from !=null){
            cadena=cadena + `&from=${from}&` 
        }
        if(to !=null){
            cadena=cadena + `to=${to}`
        }
		const res= await fetch(cadena);
		if(res.ok){
			const data= await res.json();
			esco=data;
			console.log("Received esco: " + esco.length);
		}
    }
	
	async function insertesco(){
		if (newesco.country == "" || newesco.country == null || newesco.year == "" || newesco.year == null || newesco.tot_wom == "" || newesco.tot_wom == null || newesco.tot_man == "" || newesco.tot_man == null || newesco.tot_esco == "" || newesco.tot_esco == null) {
			color="danger";
			checkMSG="Debe completar todos los campos";
			visible="true";
         }else{
        console.log("Inserting esco...."+JSON.stringify(newesco));
        const res = await fetch("/api/v1/esco-stats",
			{
				method: "POST",
				body: JSON.stringify(newesco),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res){
				if(res.status == 201){
					color="success";
					checkMSG="Entrada introducida con éxito";
					visible="true";
					newesco.country = null;
					newesco.year = null;
					newesco.tot_wom = null;
					newesco.tot_man = null;
					newesco.tot_esco = null;
				getesco();

				//window.alert("Entrada introducida con éxito");
				}
				else if(res.status == 409){
					color="danger";
					checkMSG="Ya existe ese recurso en la base de datos";
					visible="true";
					
                     //window.alert("Ya existe ese recurso en la base de datos");
                     console.log("ERROR There is already a data with that country and year in the database");
                     
                 }
			});  
    }}
	async function Borraresco(name,year){
        console.log("Deleting esco....");
        const res = await fetch("/api/v1/esco-stats/" + name +"/" + year,
			{
				method: "DELETE"
			}).then(function (res){
				getesco();
				if (res.status==200) {
					color="success";
					checkMSG=name + " entrada borrada correctamente";
					visible="true";
                console.log("Deleted " + name); 
				//window.alert(name + " elimida con éxito");           
            }else  {
				color="danger";
				checkMSG=name + "no se ha podido borrar la entrada";
				visible="true";
                //window.alert(name + " no se ha podida eliminar");
                console.log("DATA NOT FOUND");            
            
            }      
        });
    }
	async function BorrarescosAll(){
        console.log("Deleting escos....");
        const res = await fetch("/api/v1/esco-stats/",
			{
				method: "DELETE"
			}).then(function (res){
				color="success";
				checkMSG="Entradas elimidas con éxito";
				visible="true";
				getesco();
				//window.alert("Entradas elimidas con éxito");
			});
    }

	async function Loadesco(){
        console.log("Loading esco....");
        const res = await fetch("/api/v1/esco-stats/loadInitialData",
			{
				method: "GET"
			}).then(function (res){
				color="success";
				checkMSG="Entradas cargadas con éxito";
				visible="true";
				getesco();
				//window.alert("Entradas cargadas con éxito");
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
				  <DropdownItem href="./api/v2/economies">Econmies-Stats</DropdownItem>
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
				  <DropdownItem href="./#/economies-graph">econmies-Stats</DropdownItem>
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
    <h1>Tasa de escolarizacion</h1>
	<Button on:click="{getPgAnt}">
		Página Anterior
	</Button>
	<Button on:click="{getPgSig}">
		Página Siguiente
	</Button>
    {#await esco}
loading
	{:then esco}

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
					//window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos')
				}else{
					getesco();
				}
			}}">
				Buscar
				</Button>
			</td>
			<td align="center"><Button outline color="info" on:click="{()=>{
				from = null;
				to = null;
				getesco();
				
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
                <th>Escolarizacion total</th>
                <th>Escolarizacion hombres</th>
                <th>Escolarizacion mujeres</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input bind:value="{newesco.country}"></td>
				<td><input type="number" bind:value="{newesco.year}"></td>
				<td><input type="number" bind:value="{newesco.tot_wom}"></td>
				<td><input type="number" bind:value="{newesco.tot_man}"></td>
				<td><input type="number" bind:value="{newesco.tot_esco}"></td>

				<td><Button outline color="primary" on:click="{insertesco}">
					Añadir
					</Button>
				</td>
				<td align="center"><Button outline color="primary" on:click="{()=>{
					newesco.country = null;
					newesco.year = null;
					newesco.tot_wom = null;
					newesco.tot_man = null;
					newesco.tot_esco = null;
				}}">
					Limpiar
					</Button>
				</td>
			</tr>
			{#each esco as escoa}
			<tr>
				<td>{escoa.country}</td>
				<td>{escoa.year}</td>
                <td>{escoa.tot_wom}</td>
                <td>{escoa.tot_man}</td>
                <td>{escoa.tot_esco}</td>

				<td><Button outline color="warning" on:click={function (){
					window.location.href = `/#/esco/${escoa.country}/${escoa.year}`
				}}>
					Editar
				</Button>
				<td><Button outline color="danger" on:click={Borraresco(escoa.country,escoa.year)}>
					Borrar
				</Button>
				
				</td>
			</tr>
			{/each}
			<tr>
				<td><Button outline color="success" on:click={Loadesco}>
					Cargar datos
				</Button></td>
				<td><Button outline color="danger" on:click={BorrarescosAll}>
					Borrar todo
				</Button></td>
			</tr>
			
		</tbody>
	</Table>

{/await}
</main>