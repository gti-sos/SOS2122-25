<script>
    import {onMount} from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte'; 
	let esco=[];
    let newesco={
        country: "",
        year:"",
        esco_tot:"",
        esco_men:"",
        esco_wom:""
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
        const res = await fetch("/api/v1/esco/" + country +"/" + year,
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
