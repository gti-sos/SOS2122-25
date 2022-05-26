<script>
    import {onMount} from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte'; 
	import { Alert } from "sveltestrap";
	import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'sveltestrap';
	

	let economies=[];
	let datos2 = [];
	let offset=0;
	let limit=10;
	let numEntries;

	let from=null;
	let to=null;

	let visibleError = false;
	let visibleMsg = false;
	let errorMsg = "";
	let msg = "";

    let neweconomies={
        country: "",
        year:"",
        percapita:"",
        currency:"",
        currentprices:""
    }

	onMount(getEconomies);

	async function getEconomies(){
		console.log("fetching economies ....");
		let cadena = `/api/v2/economies?offset=+${offset}+&limit=+${limit}`;
		if(from !=null){
            cadena=cadena + `&from=${from}&` 
        }
        if(to !=null){
            cadena=cadena + `to=${to}`
        }
		const res= await fetch(cadena);
		
		if(res.ok){
			
			const data= await res.json();
			datos2=data;
			economies = datos2.sort(function (a, b){
				return (a.year - b.year);
			});
			numEntries=economies.length;
			console.log("Received economies: " + economies.length);
		}
		else{
			visibleError = true;
					visibleMsg = false;
					msg = "No hay ningún dato entre "+from+" y "+to;
				//window.alert("No hay ningún dato entre estos límites")
			}
	}
	async function getPgAnt() {
		if(offset>=10){

			offset=offset-10;
		}
		//limit=limit+10;
        console.log("fetching economies ....");
		let cadena = `/api/v2/economies?offset=+${offset}+&limit=+${limit}`;
		if(from !=null){
            cadena=cadena + `&from=${from}&` 
        }
        if(to !=null){
            cadena=cadena + `to=${to}`
        }
		const res= await fetch(cadena);
		if(res.ok){
			const data= await res.json();
			datos2=data;
			economies = datos2.sort(function (a, b){
				return (a.year - b.year);
			});
			console.log("Received economies: " + economies.length);
		}
    }
	async function getPgSig() {
		if(economies.length>=10){

			offset=offset+10;
		}
		//limit=limit+10;
        console.log("fetching economies ....");
		let cadena = `/api/v2/economies?offset=+${offset}+&limit=+${limit}`;
		if(from !=null){
            cadena=cadena + `&from=${from}&` 
        }
        if(to !=null){
            cadena=cadena + `to=${to}`
        }
		const res= await fetch(cadena);
		if(res.ok){
			const data= await res.json();
			datos2=data;
			economies = datos2.sort(function (a, b){
				return (a.year - b.year);
			});
			console.log("Received economies: " + economies.length);
		}
    }
	
	async function insertEconomies(){
		if (neweconomies.country == "" || neweconomies.country == null || neweconomies.year == "" || neweconomies.year == null|| neweconomies.percapita == "" || neweconomies.percapita == null || neweconomies.currency == "" || neweconomies.currency == null || neweconomies.currentprices == "" || neweconomies.currentprices == null) {
			visibleError = true;
					visibleMsg = false;
					msg = "Debe de rellenar todos los campos";
         }
		 else{
        console.log("Inserting economies...."+JSON.stringify(neweconomies));
        const res = await fetch("/api/v2/economies",
			{
				method: "POST",
				body: JSON.stringify(neweconomies),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res){
				if(res.status == 201){
				getEconomies();
				neweconomies.country = null;
					neweconomies.year = null;
					neweconomies.percapita = null;
					neweconomies.currency = null;
					neweconomies.currentprices = null;
				visibleError = false;
					visibleMsg = true;
					msg = "Entrada introducida con éxito";}
				
				else if(res.status == 409){
                     
					 visibleError = true;
					visibleMsg = false;
					msg = "Ya existe ese recurso en la base de datos";
                     console.log("ERROR There is already a data with that country and year in the database");
                     
                 }
			}); 
    }}
	async function BorrarEconomies(name, year) {
        const res = await fetch("/api/v2/economies/"+name+"/"+year, {
            method: "DELETE"
        }).then(function(res) {
           
            getEconomies();      
            if (res.status==200) {
                console.log("Deleted " + name); 
				//window.alert(name + " elimida con éxito"); 
				visibleError = false;
					visibleMsg = true;
					msg = name + " elimida con éxito";				          
            }else  {
                //window.alert(name + " no se ha podida eliminar");
				visibleError = true;
					visibleMsg = flase;
					msg = name + " no se ha podida eliminar";
                console.log("DATA NOT FOUND");            
            
            }      
        });
    }
	async function BorrarEconomiesAll(){
        console.log("Deleting economies....");
        const res = await fetch("/api/v2/economies/",
			{
				method: "DELETE"
			}).then(function (res){
				getEconomies();
				//window.alert("Entradas elimidas con éxito");
				visibleError = false;
					visibleMsg = true;
					msg = "Entradas elimidas con éxito";
			});
    }

	async function LoadEconomies(){
        console.log("Loading economies....");
        const res = await fetch("/api/v2/economies/loadInitialData",
			{
				method: "GET"
			}).then(function (res){
				getEconomies();
				//window.alert("Entradas cargadas con éxito");
				visibleError = false;
					visibleMsg = true;
					msg = "Entradas cargadas con éxito";
			});
    }
</script>

<main>
	<!--barra de navegacion-->
	<Navbar style="background-color: lightgreen; color:white;" light expand="lg" >
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
				  <DropdownItem href="./#/economies">economies FRONT-END</DropdownItem>
				  <DropdownItem href="./#/esco-stats">esco FRONT-END</DropdownItem>
				  <DropdownItem href="./#/expo">expo FRONT-END</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="#/graph">Conjunto</DropdownItem>
				</DropdownMenu>
			  </Dropdown>
			  
			  <Dropdown >
				<DropdownToggle nav caret> Gráficas </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./#/economies-graph">economies-Stats</DropdownItem>
				  <DropdownItem href="./#/graphesco">esco-Stats</DropdownItem>
				  <DropdownItem href="./#/graphexpo">expo-Stats</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="#/graph">Conjunto</DropdownItem>
				</DropdownMenu>
			  </Dropdown>
		  <!--<NavItem>
			<NavLink style="float:right; margin:left;" href="#/about">Acerca de</NavLink>
		  </NavItem>-->
		</Nav>
	</Navbar>
	<!---->
    <h1>Economia Mundial</h1>
	<Alert color="danger" isOpen={visibleError} toggle={() => (visibleError = false)}>
		{#if msg}
			<p>ERROR: {msg}</p>
		   {/if}
	</Alert>
	<Alert color="success" isOpen={visibleMsg} toggle={() => (visibleMsg = false)}>
		{#if msg}
			<p>Correcto: {msg}</p>
		{/if}
	</Alert>
	<Button on:click="{getPgAnt}">
		Página Anterior
	</Button>
	<Button on:click="{getPgSig}">
		Página Siguiente
	</Button>
    {#await economies}
loading
	{:then economies}
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
                    //window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos')
					visibleError = true;
					visibleMsg = false;
					msg = "Los campos fecha inicio y fecha fin no pueden estar vacíos";
                }else{
                    getEconomies();
                }
            }}">
                Buscar
                </Button>
            </td>
            <td align="center"><Button outline color="info" on:click="{()=>{
                from = null;
                to = null;
                getEconomies();
                
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
                <th>percapita</th>
                <th>currency</th>
                <th>currentprices</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input bind:value="{neweconomies.country}"></td>
				<td><input type="number" bind:value="{neweconomies.year}"></td>
				<td><input type="number" bind:value="{neweconomies.percapita}"></td>
				<td><input type="number" bind:value="{neweconomies.currency}"></td>
				<td><input type="number" bind:value="{neweconomies.currentprices}"></td>

				<td align="center"><Button outline color="primary" on:click="{insertEconomies}">
					Añadir
					</Button>
					
				</td>
				<td align="center"><Button outline color="primary" on:click="{()=>{
					neweconomies.country = null;
					neweconomies.year = null;
					neweconomies.percapita = null;
					neweconomies.currency = null;
					neweconomies.currentprices = null;
				}}">
					Limpiar
					</Button>
				</td>
				
			</tr>
			
			{#each economies as cd}
			<tr>
				<td>{cd.country}</td>
				<td>{cd.year}</td>
                <td>{cd.percapita}</td>
                <td>{cd.currency}</td>
                <td>{cd.currentprices}</td>

				<td align="center"><Button outline color="warning" on:click={function (){
					window.location.href = `/#/economies/${cd.country+"/"+cd.year}`
				}}>
					Editar
				</Button>
				<td align="center"><Button outline color="danger" on:click={BorrarEconomies(cd.country,cd.year)}>
					Borrar
				</Button>
				</td>
			</tr>
			{/each}
			<tr>
				<td><Button outline color="success" on:click={LoadEconomies}>
					Cargar datos
				</Button></td>
				<td><Button outline color="danger" on:click={BorrarEconomiesAll}>
					Borrar todo
				</Button></td>
			</tr>
			
		</tbody>
	</Table>

{/await}
</main>