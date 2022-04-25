<script>
    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';

	let economies=[];
	let newEconomies= {
		country: "",
		year: "",
		percapita: "",
		currency: "",
		currentprices:""
		
	};


	let from = null;
	let to = null;
	let offset = 0;
	let limit = 10;
	let maxPages = 0;

	let loading = true;
	let p1;

	onMount(getEconomies);

	async function getEconomies(){
		console.log("fetching ...");
		const res =await fetch("/api/v1/economies");
		if(res.ok){
			const data = await res.json();
			economies = data;
			console.log("Received countries: "+economies.length);
		}
	}

	async function maxPagesFunction(total){
		maxPages = Math.floor(total/10);
		if(maxPages === total/10){
			maxPages = maxPages-1;
		}
	}


	async function insertEconomies(){
		console.log("Insterting Economies:"+JSON.stringify(newEconomies));
		const res =await fetch("/api/v1/economies",
					{
						method: "POST",
						body: JSON.stringify(newEconomies),
						headers: {
							"Content-type":"application/json"
						}

					}).then(function(res){
						getEconomies();
					});
		console.log("DONE");
	}

	async function busqueda (Ucountry,Uyear,Ufrom,Uto,coefficients,educations,lifes){
		if(typeof Ucountry=='undefined'){
			Ucountry="";
		}
		if(typeof Uyear=='undefined'){
			Uyear="";
		}
        if(typeof Ufrom=='undefined'){
			Ufrom="";
		}
        if(typeof Uto=='undefined'){
			Uto="";
		}

        
		const res = await fetch("/api/v1/economies?country="+Ucountry+"&year="+Uyear+"&from="+Ufrom+"&to="+Uto)
		if (res.ok){
			const json = await res.json();
			inequality_stats = json;
			console.log("Found "+ inequality_stats.length + " countries");
			
			if(inequality_stats.length==1){
				exitoMsg = "Se ha encontrado " + inequality_stats.length + " paises";
			}else{
				exitoMsg = "Se han encontrado " + inequality_stats.length + " paises";
			}
		}else if (res.status==404){
			window.alert("No hay países con los parámetros introducidos");
			console.log("ERROR");
		}
	}
    async function getNextPage() {
        console.log(totaldata);
        if (page+10 > totaldata) {
            page = 1
        } else {
            page+=10
        }
        
        visible = true;
        console.log("Charging page... Listing since: "+page);
        const res = await fetch("/api/v1/economies?limit=10&offset="+(-1+page));
        color = "success";
        errorMSG= (page+5 > totaldata) ? "Mostrando elementos "+(page)+"-"+totaldata : "Mostrando elementos "+(page)+"-"+(page+9);
        if (totaldata == 0){
            console.log("ERROR Data was not erased");
            color = "danger";
            errorMSG= "¡No hay datos!";
        }else if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            inequality_stats = json;
            console.log("Received " + inequality_stats.length + " resources.");
        } else {
            errorMSG= res.status + ": " + res.statusText;
            console.log("ERROR!");
        }
    }
     
    async function getPreviewPage() {
        console.log(totaldata);
        if (page-10 > 1) {
            page-=5; 
        } else page = 1
        visible = true;
        console.log("Charging page... Listing since: "+page);
        const res = await fetch("/api/v1/economies?limit=10&offset="+(-1+page));
        color = "success";
        errorMSG= (page+5 > totaldata) ? "Mostrando elementos "+(page)+"-"+totaldata : "Mostrando elementos "+(page)+"-"+(page+9);
        if (totaldata == 0){
            console.log("ERROR Data was not erased");
            color = "danger";
            errorMSG= "¡No hay datos!";
        }else if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            inequality_stats = json;
            console.log("Received "+inequality_stats.length+" resources.");
        } else {
            errorMSG= res.status+": "+res.statusText;
            console.log("ERROR!");
        }
    }


	async function BorrarEconomy(countryDelete, yearDelete){
        console.log("Deleting entry....");
        const res = await fetch("/api/v1/economies/"+countryDelete+"/"+yearDelete,
			{
				method: "DELETE"
			}).then(function (res){
				getEconomies();
				window.alert("Entrada eliminada con éxito");
			});
    }

	async function BorrarEconomies(){
        console.log("Deleting economies....");
        const res = await fetch("/api/v1/economies",
			{
				method: "DELETE"
			}).then(function (res){
				getEconomies();
				window.alert("Entradas elimidas con éxito");
			});
    }


	async function LoadEconomies(){
        console.log("Loading economies....");
        const res = await fetch("/api/v1/economies/loadInitialData",
			{
				method: "GET"
			}).then(function (res){
				getEconomies();
				window.alert("Entradas cargadas con éxito");
			});
    }
</script>

<main>
    {#await economies}
loading
	{:then economies}
	{p1}

	<Table bordered>
		<thead>
			<tr>
				<th>Fecha Inicio</th>
                <th>Fecha Fin</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input bind:value="{from}"></td>
				<td><input bind:value="{to}"></td>
				<td><Button outline color="primary" on:click="{getEconomies}">Buscar</Button></td>
				<td align="center"><Button outline color="info" on:click="{()=>{
					from = null;
					to = null;
					getEconomies();
				}}">
					Limpiar Búsqueda
					</Button>
			</tr>
		</tbody>
		
	</Table>
<Button id ="atrasbtn" on:click="{getPreviewPage}">
	Atrás
</Button>
<Button id ="siguientebtn" on:click="{getNextPage}">
	Siguiente
</Button>
		<div style="text-align:center;padding-bottom: 1%">
			<Button outline color="primary" on:click="{busqueda (economies.country, economies.year,from,to,)}">Buscar</Button>
		</div>
	<Table bordered>
		<thead>
			<tr>
				<th>Pais</th>
				<th>Año</th>
				<th>PerCapita</th>
				<th>currency</th>
				<th>PreciosActual</th>
				<th>Acciones</th>
			</tr>
		</thead>
		<tbody>
				<tr>
					<td><input bind:value="{newEconomies.country}"></td>
					<td><input bind:value="{newEconomies.year}"></td>
					<td><input bind:value="{newEconomies.percapita}"></td>
					<td><input bind:value="{newEconomies.currency}"></td>
					<td><input bind:value="{newEconomies.currentprices}"></td>
					<td><Button 
						outline
						color= "primary"
						on:click={insertEconomies}>insert</Button>
					</td>
				</tr>
				{#each economies as economy}
				<tr>
					<td><a href="#/economiesTable/{economy.country}">{economy.country}</a></td>
					<td>{economy.year}</td>
					<td>{economy.percapita}</td>
					<td>{economy.currency}</td>
					<td>{economy.currentprices}</td>
					<td><Button outline color="warning" on:click={function (){
						window.location.href ="#/economiesTable/"+economy.country
					}}>
						Editar
					</Button>
					<td><Button outline color="danger" on:click={BorrarEconomy(economy.country,economy.year)}>
						Borrar
					</Button>
				</tr>
				{/each}
		</tbody>
	</Table>

	<div align="center">
		<Button outline color="success" on:click={LoadEconomies}>
			Cargar datos
		</Button>
		<Button outline color="danger" on:click={BorrarEconomies}>
			Borrar todo
		</Button>
	</div>
{/await}


</main>