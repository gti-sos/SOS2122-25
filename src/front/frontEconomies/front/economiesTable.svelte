<script>
    import { onMount } from 'svelte';
	

	let economies=[];
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
</script>

<main>
    {#await economies}
loading
	{:then economies}
	{p1}

	<table>
		<thead>
			<tr>
				<th>
					Pais
				</th>
				<th>
					Año
				</th>
				<th>
					PerCapita
				</th>
				<th>
					currency
				</th>
				<th>
					PreciosActual	
				</th>
			</tr>
		</thead>
		<tbody>
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
	</table>
{/await}
</main>