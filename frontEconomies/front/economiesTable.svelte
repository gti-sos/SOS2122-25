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
					Country
				</th>
				<th>
					Year
				</th>
				<th>
					PerCapitat
				</th>
				<th>
					currency
				</th>
				<th>
					CurrentPrices
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