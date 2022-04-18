<script>
    import { onMount } from 'svelte';
		import Table from 'sveltestrap/src/Table.svelte';
		import Button from 'sveltestrap/src/Button.svelte';
	

	let expo=[];
	let loading = true;
	let p1;

	onMount(getExpo);

	async function getExpo(){
		console.log("fetching ...");
		const res =await fetch("/api/v1/expo");
		if(res.ok){
			const data = await res.json();
			expo = data;
			console.log("Received countries: "+expo.length);
		}

	}
</script>

<main>
    {#await expo}
loading
	{:then expo}
	{p1}

	<Table bordered>
		<thead>
			<tr>
				<th>
					País
				</th>
				<th>
					Año
				</th>
				<th>
					Expo_tec
				</th>
				<th>
					Expo_m
				</th>
				<th>
					Expo_bys
				</th>
			</tr>
		</thead>
		<tbody>
				{#each expo as expos}
				<tr>
					<td>{expos.country}</td>
					<td>{expos.year}</td>
					<td>{expos.percapita}</td>
					<td>{expos.currency}</td>
					<td>{expos.currentprices}</td>
				</tr>
				{/each}
		</tbody>
	</Table>
{/await}
</main>