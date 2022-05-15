<script>
    import {onMount} from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte'; 
	import Alert from 'sveltestrap/src/Alert.svelte';
	import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'sveltestrap';

	let expo=[];
	let from=null;
	let to=null;
	let offset=0;
	let limit=10;

	let numEntries;
	let checkMSG = "";
    let visible = false;
    let color = "danger";

    let newExpo={
        country: "",
        year:"",
        expo_tec:"",
        expo_m:"",
        tot_esco:""
    }

	onMount(getExpo);

	async function getExpo(){
		console.log("fetching exports ....");
		let cadena=`/api/v1/expo?offset=+${offset}+&limit=+${limit}`;
		if(from !=null){
			cadena=cadena + `&from=${from}&` 
		}
		if(to !=null){
			cadena=cadena + `to=${to}`
		}

		const res= await fetch(cadena);
		if(res.ok){
			const data= await res.json();
			expo=data;
			numEntries=expo.length;
			console.log("Received expo: " + expo.length);
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
        console.log("fetching exports ....");
		let cadena = `/api/v1/expo?offset=+${offset}+&limit=+${limit}`;
		if(from !=null){
            cadena=cadena + `&from=${from}&` 
        }
        if(to !=null){
            cadena=cadena + `to=${to}`
        }
		const res= await fetch(cadena);
		if(res.ok){
			const data= await res.json();
			expo=data;
			console.log("Received expo: " + expo.length);
		}
    }
	async function getPgSig() {
		if(expo.length>=10){

			offset=offset+10;
		}
		//limit=limit+10;
        console.log("fetching expo ....");
		let cadena = `/api/v1/expo?offset=+${offset}+&limit=+${limit}`;
		if(from !=null){
            cadena=cadena + `&from=${from}&` 
        }
        if(to !=null){
            cadena=cadena + `to=${to}`
        }
		const res= await fetch(cadena);
		if(res.ok){
			const data= await res.json();
			expo=data;
			console.log("Received expo: " + expo.length);
		}
    }
	
	async function insertExpo(){
		if (newExpo.country == "" || newExpo.country == null || newExpo.year == "" || newExpo.year == null) {
			color="danger";
			checkMSG="Debes insertar el nombre del país y el año.";
			visible="true";
         }else{
        console.log("Inserting Expo...."+JSON.stringify(newExpo));
        const res = await fetch("/api/v1/expo",
			{
				method: "POST",
				body: JSON.stringify(newExpo),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res){
				if(res.status == 201){
					color="success";
					checkMSG="Entrada introducida con éxito";
					visible="true";
				getExpo();
				
				}
				else if(res.status == 409){
					color="danger";
					checkMSG="Ya existe ese recurso en la base de datos";
					visible="true";
                     console.log("ERROR There is already a data with that country and year in the database");
                     
                 }
			});  
    }}
	async function BorrarExpo(name, year) {
        const res = await fetch("/api/v1/expo/"+name+"/"+year, {
            method: "DELETE"
        }).then(function(res) {
           
            getExpo();      
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
	async function BorrarExpoAll(){
        console.log("Deleting Expo....");
        const res = await fetch("/api/v1/expo/",
			{
				method: "DELETE"
			}).then(function (res){
				
				color="success";
				checkMSG="Entradas elimidas con éxito";
				visible="true";
				getExpo();
			});
    }

	async function LoadExpo(){
        console.log("Loading expo....");
        const res = await fetch("/api/v1/expo/loadInitialData",
			{
				method: "GET"
			}).then(function (res){
				getExpo();
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
				  <DropdownItem href="./api/v1/expo">expo-Stats</DropdownItem>
				</DropdownMenu>
            </Dropdown>
              
            <Dropdown>
				<DropdownToggle nav caret> FRONT-END </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./#/economies">Economies FRONT-END</DropdownItem>
				  <DropdownItem href="./#/esco-stats">esco FRONT_END</DropdownItem>
				  <DropdownItem href="#/expo">Expo FRONT-END</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="#/graph">Conjunto</DropdownItem>
				</DropdownMenu>
			  </Dropdown>
			  
			  <Dropdown >
				<DropdownToggle nav caret> Gráficas </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./#/economies-graph">economies</DropdownItem>
				  <DropdownItem href="./#/graphesco">esco-Stats</DropdownItem>
				  <DropdownItem href="#/graphexpo">expo-Stats</DropdownItem>
                  <DropdownItem href="#/graph">Grafica comun</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="#/graph">Conjunto</DropdownItem>
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
    {#await expo}
loading
	{:then expo}
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
					getExpo();
				}
			}}">
				Buscar
				</Button>
			</td>
			<td align="center"><Button outline color="info" on:click="{()=>{
				from = null;
				to = null;
				getExpo();
				
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
                <th>Exportaciones Tecnológicas</th>
                <th>Exportaciones Productos Manufacturados</th>
                <th>Exportaciones Bienes y Servicios</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input bind:value="{newExpo.country}"></td>
				<td><input type="number" bind:value="{newExpo.year}"></td>
				<td><input bind:value="{newExpo.expo_tec}"></td>
				<td><input bind:value="{newExpo.expo_m}"></td>
				<td><input bind:value="{newExpo.tot_esco}"></td>

				<td><Button outline color="primary" on:click="{insertExpo}">
					Añadir
					</Button>
				</td>
				<td align="center"><Button outline color="primary" on:click="{()=>{
					newExpo.country = null;
					newExpo.year = null;
					newExpo.expo_tec = null;
					newExpo.expo_m = null;
					newExpo.tot_esco= null;
				}}">
					Limpiar
					</Button>
				</td>
			</tr>
			{#each expo as expos}
			<tr>
				<td>{expos.country}</td>
				<td>{expos.year}</td>
                <td>{expos.expo_tec}</td>
                <td>{expos.expo_m}</td>
                <td>{expos.tot_esco}</td>

				<td><Button outline color="warning" on:click={function (){
					window.location.href = `/#/expo/${expos.country}/${expos.year}`
				}}>
					Editar
				</Button>
				<td><Button outline color="danger" on:click={BorrarExpo(expos.country,expos.year)}>
					Borrar
				</Button>
				</td>
			</tr>
			{/each}
			<tr>
				<td><Button outline color="success" on:click={LoadExpo}>
					Cargar datos
				</Button></td>
				<td><Button outline color="danger" on:click={BorrarExpoAll}>
					Borrar todo
				</Button></td>
			</tr>
			
		</tbody>
	</Table>

{/await}
</main>