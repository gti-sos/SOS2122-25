<script>
    import {onMount} from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte'; 
	import { Form } from 'sveltestrap';

	let esco=[];
    let newesco={
        country: "",
        year:"",
        esco_tot:"",
        esco_men:"",
        esco_wom:""
    }

	let Ucountry = "";
	let Uyear = "";
	let Ufrom = "";
	let Uto = "";
    let coefficients=""

	let from = null;
	let to = null;
	let offset = 0;
	let limit = 10;
	let maxPages = 0;

	let loading = true;
	let p1;

	async function pagination (Ufrom,Uto,Ucountry,Uyear){
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
        
		const res = await fetch("/api/v1/esco?from="+Ufrom+"&to="+Uto)
		if (res.ok){
			const json = await res.json();
			esco = json;
			console.log("Found "+ esco.length + " countries");
			
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
        const res = await fetch("/api/v1/esco?limit=10&offset="+(-1+page));
        color = "success";
        errorMSG= (page+5 > totaldata) ? "Mostrando elementos "+(page)+"-"+totaldata : "Mostrando elementos "+(page)+"-"+(page+9);
        if (totaldata == 0){
            console.log("ERROR Data was not erased");
            color = "danger";
            errorMSG= "¡No hay datos!";
        }else if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            esco = json;
            console.log("Received " + esco.length + " resources.");
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
        const res = await fetch("/api/v1/esco?limit=10&offset="+(-1+page));
        color = "success";
        errorMSG= (page+5 > totaldata) ? "Mostrando elementos "+(page)+"-"+totaldata : "Mostrando elementos "+(page)+"-"+(page+9);
        if (totaldata == 0){
            console.log("ERROR Data was not erased");
            color = "danger";
            errorMSG= "¡No hay datos!";
        }else if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            esco = json;
            console.log("Received "+esco.length+" resources.");
        } else {
            errorMSG= res.status+": "+res.statusText;
            console.log("ERROR!");
        }
    }

	onMount(getesco);

	async function getesco(){
		console.log("fetching esco ....");
		const res= await fetch("/api/v1/esco");
		if(res.ok){
			const data= await res.json();
			esco=data;
			console.log("Received esco: " + esco.length);
		}
	}
	async function insertesco(){
        console.log("Inserting esco...."+JSON.stringify(newesco));
        const res = await fetch("/api/v1/esco",
			{
				method: "POST",
				body: JSON.stringify(newesco),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res){
				getesco();
				window.alert("Entrada introducida con éxito");
			}); 
    }
	async function Borraresco(country,year){
        console.log("Deleting esco....");
		const res = await fetch("/api/v1/esco/"+countryDelete+"/"+yearDelete,
		{
				method: "DELETE"
			}).then(function (res){
				getesco();
				window.alert("Entrada eliminada con éxito");
			});
    }

	async function Borrarescos(){
        console.log("Deleting escos....");
        const res = await fetch("/api/v1/esco/",
			{
				method: "DELETE"
			}).then(function (res){
				getesco();
				window.alert("Entradas elimidas con éxito");
			});
    }
	async function Loadesco(){
        console.log("Loading esco....");
        const res = await fetch("/api/v1/esco/loadInitialData",
			{
				method: "GET"
			}).then(function (res){
				getesco();
				window.alert("Entradas cargadas con éxito");
			});
    }
</script>

<main>
    <h1>Tasa de escolarizacion</h1>
    {#await esco}
	loading
	{:then esco}
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
				<td><Button outline color="primary" on:click="{pagination (Ufrom,Uto,Ucountry, Uyear)}">Buscar</Button></td>
				<td align="center"><Button outline color="info" on:click="{()=>{
					Ufrom = null;
					Uto = null;
					getesco();
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
				<td><input bind:value="{newesco.year}"></td>
				<td><input bind:value="{newesco.esco_tot}"></td>
				<td><input bind:value="{newesco.esco_men}"></td>
				<td><input bind:value="{newesco.esco_wom}"></td>

				<td><Button outline color="primary" on:click="{insertesco}">
					Añadir
					</Button>
				</td>
			</tr>
			{#each esco as esco}
			<tr>
				<td>{esco.country}</td>
				<td>{esco.year}</td>
                <td>{esco.esco_tot}</td>
                <td>{esco.esco_men}</td>
                <td>{esco.esco_wom}</td>

				<td><Button outline color="warning" on:click={function (){
					window.location.href = `/#/esco/${esco.country}`
				}}>
					Editar
				</Button>
				<td><Button outline color="danger" on:click={Borraresco}>
					Borrar
				</Button>
				</td>
			</tr>
			{/each}
			<tr>
				<td><Button outline color="success" on:click={Loadesco}>
					Cargar datos
				</Button></td>
				<td><Button outline color="danger" on:click={Borrarescos}>
					Borrar todo
				</Button></td>
			</tr>
			
		</tbody>
	</Table>

{/await}
</main>
