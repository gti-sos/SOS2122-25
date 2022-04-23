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
</script>

<main>
    {#await economies}
loading
	{:then economies}
	{p1}

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
					<td>{economy.country}</td>
					<td>{economy.year}</td>
					<td>{economy.percapita}</td>
					<td>{economy.currency}</td>
					<td>{economy.currentprices}</td>
				</tr>
				{/each}
		</tbody>
	</Table>
{/await}


</main>