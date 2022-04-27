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

	let Ucountry = "";
	let Uyear = "";
	let Ufrom = "";
	let Uto = "";
    let coefficients=""
	let color = "danger";
	let errorMSG = null;

	let from = null;
	let to = null;
	let offset = 0;
	let limit = 10;
	let maxPages = 0;
	let totaldata=11;
	let page=1;
	let visible = false;

	let loading = true;
	let p1;

	onMount(getEconomies);

	async function getEconomies(){
		console.log("fetching ...");
		const res =await fetch("/api/v2/economies");
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
		 
         console.log("Inserting inequality data...");
         //Comprobamos que el año y la fecha no estén vacíos, el string vacio no es null
         if (newEconomies.country == "" || newEconomies.country == null || newEconomies.year == "" || newEconomies.year == null) {
             alert("Debes insertar el nombre del país y el año.");
         }
         else{
             const res = await fetch("/api/v2/economies",{
             method:"POST",
             body:JSON.stringify(newEconomies),
             headers:{
                 "Content-Type": "application/json"
             }
             }).then(function (res) {
                 if(res.status == 201){
                    getEconomies();
                     //window.alert("Se introdujo el dato");
                     console.log("Data introduced");
                     errorMSG = 201;
                 }
                 else if(res.status == 400){
                     window.alert("No se introdujo bien el dato");
                     console.log("ERROR Data was not correctly introduced");
                     errorMSG = 400;
                 }
                 else if(res.status == 409){
                     window.alert("Ya existe ese recurso en la base de datos");
                     console.log("ERROR There is already a data with that country and year in the database");
                     errorMSG = 409;
                 }
             });	
         }
     }
    //DELETE SPECIFIC
    async function deleteData(name, year) {
        const res = await fetch("/api/v2/economies/" + name + "/" + year, {
            method: "DELETE"
        }).then(function (res) {
            visible = true;
            getData();      
            if (res.status==200) {
                totaldata--;
                errorMSG = 200.2;
                console.log("Deleted " + name);            
            }else if (res.status==404) {
                errorMSG = 404;
                console.log("DATA NOT FOUND");            
            } else {
                //color = "danger";
                errorMSG= res.status;// + ": " + res.statusText;
                console.log("ERROR!");
            }      
        });
    }
    //DELETE ALL
    async function deleteALL() {
		console.log("Deleting inequality data...");
			console.log("Deleting all unemployment data...");
			const res = await fetch("/api/v2/economies/", {
				method: "DELETE"
			}).then(function (res) {
				if(res.ok){
                    totaldata = 0;
					getData();
                    errorMSG = 200.3;
                    //window.alert("Datos eliminados correctamente");
					console.log("Datos eliminados correctamente");
                    location.reload();
				}
				else{
					console.log("Ha habido un fallo. No se han eliminado los datos");
                    errorMSG = 404.2;
				}
			});
		
	}
	async function paginacion (Ufrom,Uto,Ucountry,Uyear){
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
		if(typeof coefficients=='undefined'){
			coefficients="";
		}
        // /api/v1/economies?from=2019&to=2020
		const res = await fetch("/api/v2/economies?from="+Ufrom+"&to="+Uto)
		if (res.ok){
			const json = await res.json();
			economies = json;
			console.log("Found "+ economies.length + " countries");
			window.alert(economies.length + " paises encontrados");
			
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
        const res = await fetch("/api/v2/economies?limit=10&offset="+(-1+page));
        color = "success";
        errorMSG= (page+5 > totaldata) ? "Mostrando elementos "+(page)+"-"+totaldata : "Mostrando elementos "+(page)+"-"+(page+9);
        if (totaldata == 0){
            console.log("ERROR Data was not erased");
            color = "danger";
            errorMSG= "¡No hay datos!";
        }else if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            economies = json;
            console.log("Received " + economies.length + " resources.");
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
        const res = await fetch("/api/v2/economies?limit=10&offset="+(-1+page));
        color = "success";
        errorMSG= (page+5 > totaldata) ? "Mostrando elementos "+(page)+"-"+totaldata : "Mostrando elementos "+(page)+"-"+(page+9);
        if (totaldata == 0){
            console.log("ERROR Data was not erased");
            color = "danger";
            errorMSG= "¡No hay datos!";
        }else if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            economies = json;
            console.log("Received "+economies.length+" resources.");
        } else {
            errorMSG= res.status+": "+res.statusText;
            console.log("ERROR!");
        }
    }


	async function BorrarEconomy(countryDelete, yearDelete){
        console.log("Deleting entry....");
        const res = await fetch("/api/v2/economies/"+countryDelete+"/"+yearDelete,
			{
				method: "DELETE"
			}).then(function (res){
				getEconomies();
				window.alert("Entrada eliminada con éxito");
			});
    }

	async function BorrarEconomies(){
        console.log("Deleting economies....");
        const res = await fetch("/api/v2/economies",
			{
				method: "DELETE"
			}).then(function (res){
				getEconomies();
				window.alert("Entradas elimidas con éxito");
			});
    }


	async function LoadEconomies(){
        console.log("Loading economies....");
        const res = await fetch("/api/v2/economies/loadInitialData",
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
				<td><input bind:value="{Ufrom}"></td>
				<td><input bind:value="{Uto}"></td>
				<td><Button outline color="primary" on:click="{paginacion (Ufrom,Uto,Ucountry, Uyear)}">Buscar</Button></td>
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